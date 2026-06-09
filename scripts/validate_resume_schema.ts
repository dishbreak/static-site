import { readFileSync } from "fs";
import { ResumeSchema } from "../lib/resume.ts";
import { parse } from "yaml";

const yamlContents = parse(readFileSync("data/resume.yaml", 'utf-8'))
ResumeSchema.parse(yamlContents)
console.log("resume is valid!")
