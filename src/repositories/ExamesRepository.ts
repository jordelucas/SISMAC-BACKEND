import { EntityRepository, Repository } from "typeorm";
import { Exame } from "../models/Exame";

@EntityRepository(Exame)
class ExamesRepository extends Repository<Exame>{

}

export { ExamesRepository }