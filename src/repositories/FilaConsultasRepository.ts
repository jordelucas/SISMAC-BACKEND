import { EntityRepository, Repository } from "typeorm";
import { FilaConsultas } from "../models/FilaConsultas";

@EntityRepository(FilaConsultas)
class FilaConsultasRepository extends Repository<FilaConsultas>{

}

export { FilaConsultasRepository }