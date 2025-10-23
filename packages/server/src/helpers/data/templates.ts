import z from "zod";
import { db } from "../../database/db";
import { attachmentsTable } from "../../database";
import wai from "./list/wai";
import eon from "./list/eon";
import camba from "./list/camba";

export const portfolioTemplates = [wai, eon, camba];
