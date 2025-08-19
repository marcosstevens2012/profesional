import { Injectable } from "@nestjs/common";

@Injectable()
export class ProfilesService {
  create(createProfileDto: any) {
    return { message: "Profile created", data: createProfileDto };
  }

  findAll() {
    return { message: "All profiles", data: [] };
  }

  findOne(id: string) {
    return { message: `Profile ${id}`, data: { id } };
  }

  update(id: string, updateProfileDto: any) {
    return { message: `Profile ${id} updated`, data: updateProfileDto };
  }

  remove(id: string) {
    return { message: `Profile ${id} deleted` };
  }
}
