import { EntityRepository, Repository } from "typeorm";
import { VagaConsultas } from "../models/VagaConsultas";

@EntityRepository(VagaConsultas)
class VagaConsultasRepository extends Repository<VagaConsultas>{

}

export { VagaConsultasRepository }