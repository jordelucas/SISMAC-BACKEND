import { EntityRepository, Repository } from "typeorm";
import { Paciente } from "../models/Paciente";

@EntityRepository(Paciente)
class PacientesRepository extends Repository<Paciente>{

}

export { PacientesRepository }