import { EntityRepository, Repository } from "typeorm";
import { VagaExames } from "../models/VagaExames";

@EntityRepository(VagaExames)
class VagaExamesRepository extends Repository<VagaExames>{

}

export { VagaExamesRepository }