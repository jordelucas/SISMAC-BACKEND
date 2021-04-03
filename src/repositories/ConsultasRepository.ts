import { EntityRepository, Repository } from "typeorm";
import { Consulta } from "../models/Consulta";

@EntityRepository(Consulta)
class ConsultasRepository extends Repository<Consulta>{

}

export { ConsultasRepository }