import { EntityRepository, Repository } from "typeorm";
import { Agendamento } from "../models/Agendamento";

@EntityRepository(Agendamento)
class AgendamentosRepository extends Repository<Agendamento>{

}

export { AgendamentosRepository }