import { z } from "zod";
import { Branch } from "@/enums";

export const branchSchema = z.nativeEnum(Branch);
