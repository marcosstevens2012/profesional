import React, { useEffect, useRef, useState } from "react";

interface JitsiMeetingProps {
  roomName: string;
  userDisplayName: string;
  userEmail?: string;
  onConferenceJoined?: () => void;
  onConferenceLeft?: () => void;
  onParticipantJoined?: (_participant: any) => void;
  onParticipantLeft?: (_participant: any) => void;
  onVideoConferenceLeft?: () => void;
  configOverride?: any;
  interfaceConfigOverride?: any;
  maxDuration?: number; // en milisegundos, por defecto 18 minutos
}

export const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
  roomName,
  userDisplayName,
  userEmail,
  onConferenceJoined,
  onConferenceLeft,
  onParticipantJoined,
  onParticipantLeft,
  onVideoConferenceLeft,
  configOverride = {},
  interfaceConfigOverride = {},
  maxDuration = 18 * 60 * 1000, // 18 minutos por defecto
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConsent, setShowConsent] = useState(true);
  const [hasConsented, setHasConsented] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(maxDuration);

  useEffect(() => {
    // Cleanup en unmount
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!hasConsented) return;

    // Cargar la API de Jitsi
    const loadJitsiScript = () => {
      if (window.JitsiMeetExternalAPI) {
        initializeJitsi();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = initializeJitsi;
      document.head.appendChild(script);
    };

    const initializeJitsi = () => {
      if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) return;

      const domain = "meet.jit.si";

      const defaultConfig = {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: true, // Pre-join screen
        enableClosePage: false,
        disableInviteFunctions: true,
        disableAddingParticipants: true,
        enableEmailInStats: false,
        // Safari-specific audio fixes
        disableAudioLevels: true, // Reduce audio sink errors
        enableNoAudioDetection: false, // Disable problematic audio detection
        enableNoisyMicDetection: false, // Disable noisy mic detection
        // Reduce audio device switching attempts
        disableDeepLinking: true,
        enableUserRolesBasedOnToken: false,
        toolbarButtons: [
          "microphone",
          "camera",
          "closedcaptions",
          "desktop",
          "embedmeeting",
          "fullscreen",
          "fodeviceselection",
          "hangup",
          "profile",
          "recording",
          "livestreaming",
          "etherpad",
          "sharedvideo",
          "settings",
          "raisehand",
          "videoquality",
          "filmstrip",
          "invite",
          "feedback",
          "stats",
          "shortcuts",
          "tileview",
          "videobackgroundblur",
          "download",
          "help",
          "mute-everyone",
        ],
        ...configOverride,
      };

      const defaultInterfaceConfig = {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: "",
        SHOW_POWERED_BY: false,
        DEFAULT_BACKGROUND: "#474747",
        ...interfaceConfigOverride,
      };

      const options = {
        roomName,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        configOverwrite: defaultConfig,
        interfaceConfigOverwrite: defaultInterfaceConfig,
        userInfo: {
          displayName: userDisplayName,
          email: userEmail,
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      // Event listeners
      api.addEventListener("videoConferenceJoined", () => {
        setIsLoading(false);
        onConferenceJoined?.();

        // Iniciar contador de tiempo
        const timer = setInterval(() => {
          setTimeRemaining((prev) => {
            const newTime = prev - 1000;
            if (newTime <= 0) {
              clearInterval(timer);
              // Finalizar reunión automáticamente
              api.executeCommand("hangup");
              onVideoConferenceLeft?.();
              return 0;
            }
            return newTime;
          });
        }, 1000);

        // Almacenar referencia del timer para limpieza
        (api as any)._timer = timer;
      });

      api.addEventListener("videoConferenceLeft", () => {
        onConferenceLeft?.();
        onVideoConferenceLeft?.();
        if ((api as any)._timer) {
          clearInterval((api as any)._timer);
        }
      });

      api.addEventListener("participantJoined", (participant: any) => {
        onParticipantJoined?.(participant);
      });

      api.addEventListener("participantLeft", (participant: any) => {
        onParticipantLeft?.(participant);
      });
    };

    loadJitsiScript();
  }, [
    hasConsented,
    roomName,
    userDisplayName,
    userEmail,
    maxDuration,
    configOverride,
    interfaceConfigOverride,
    onConferenceJoined,
    onConferenceLeft,
    onParticipantJoined,
    onParticipantLeft,
    onVideoConferenceLeft,
  ]);

  const handleConsent = () => {
    setHasConsented(true);
    setShowConsent(false);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (showConsent) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Permisos para Videollamada
          </h2>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Para participar en esta videollamada profesional, necesitamos su
              consentimiento para:
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Acceder a su cámara y micrófono</li>
              <li>Procesar audio y video para la sesión</li>
              <li>Permitir grabación si es solicitada</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante para Safari:</strong> Después de hacer clic
                en &quot;Acepto&quot;, su navegador solicitará permisos de
                cámara y micrófono. Por favor, haga clic en &quot;Permitir&quot;
                para cada uno de ellos.
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Esta sesión tiene una duración máxima de 18 minutos. Sus datos
              solo se utilizan durante la sesión y no se almacenan.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleConsent}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Acepto y Continúo
            </button>

            <button
              onClick={() => window.history.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-gray-900">
      {/* Indicador de tiempo restante */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded z-10">
        Tiempo restante: {formatTime(timeRemaining)}
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Conectando a la reunión...</p>
          </div>
        </div>
      )}

      {/* Jitsi container */}
      <div ref={jitsiContainerRef} className="h-full w-full" />
    </div>
  );
};

// Declarar el tipo global para la API de Jitsi
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default JitsiMeeting;
