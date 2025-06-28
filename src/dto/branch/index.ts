import { Branch } from "@/enums";
import { z } from "zod";

export const branchSchema = z.nativeEnum(Branch);