import z from "zod";
import { db } from "../../database/db";
import { attachmentsTable } from "../../database";
import wai from "./list/wai";
import eon from "./list/eon";

export const portfolioTemplates = [wai, eon];
