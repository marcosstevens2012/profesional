"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRespondToReview } from "@/hooks/useProfessionalProfile";
import { Star } from "lucide-react";
import { useState } from "react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    response?: string;
    clientName: string;
    createdAt: Date;
    hasResponse: boolean;
  };
  onResponseSubmitted?: () => void;
}

export function ReviewCard({ review, onResponseSubmitted }: ReviewCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState("");
  const respondMutation = useRespondToReview();

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;

    try {
      await respondMutation.mutateAsync({
        reviewId: review.id,
        response: responseText,
      });
      setIsResponding(false);
      setResponseText("");
      onResponseSubmitted?.();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium text-gray-900">{review.clientName}</p>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {review.comment && (
          <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
        )}

        {review.response && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mt-3">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Tu respuesta:
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {review.response}
            </p>
          </div>
        )}

        {!review.hasResponse && !isResponding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsResponding(true)}
            className="mt-3"
          >
            Responder
          </Button>
        )}

        {isResponding && (
          <div className="mt-4 space-y-3">
            <textarea
              className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Escribe tu respuesta..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {responseText.length}/500 caracteres
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsResponding(false);
                    setResponseText("");
                  }}
                  disabled={respondMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitResponse}
                  disabled={!responseText.trim() || respondMutation.isPending}
                >
                  {respondMutation.isPending ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
