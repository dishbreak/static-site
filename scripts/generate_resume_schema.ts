import { writeFileSync } from "fs";
import { ResumeSchema } from "../lib/resume.ts";
import * as z from "zod";

writeFileSync("data/resume.schema.json", JSON.stringify(z.toJSONSchema(ResumeSchema)), {})
