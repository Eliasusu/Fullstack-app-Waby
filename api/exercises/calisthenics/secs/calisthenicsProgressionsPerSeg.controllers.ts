import { Request, Response } from "express";
import { Exercise } from "../../exercise.entity.js";
import { orm } from "../../../shared/db/orm.js";

const em = orm.em;

