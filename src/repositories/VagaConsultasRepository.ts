import { EntityRepository, Repository } from "typeorm";
import { VagaConsultas } from "../models/VagaConsultas";

@EntityRepository(VagaConsultas)
class VagaConsultassRepository extends Repository<VagaConsultas>{

}

export { VagaConsultassRepository }