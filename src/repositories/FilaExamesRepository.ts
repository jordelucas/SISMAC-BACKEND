import { EntityRepository, Repository } from "typeorm";
import { FilaExames } from "../models/FilaExames";

@EntityRepository(FilaExames)
class FilaExamesRepository extends Repository<FilaExames>{

}

export { FilaExamesRepository }