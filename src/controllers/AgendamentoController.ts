import { Request, Response } from "express";
import { getCustomRepository, MoreThan } from "typeorm";
import { AgendamentosRepository } from "../repositories/AgendamentoRepository";
import { FilaConsultasRepository } from "../repositories/FilaConsultasRepository";
import { FilaExamesRepository } from "../repositories/FilaExamesRepository";
import { VagaConsultasRepository } from "../repositories/VagaConsultasRepository";
import { VagaExamesRepository } from "../repositories/VagaExamesRepository";

class AgendamentoController {
  async toSchedule(request: Request, response: Response) {
    
    const agendamentoRepository = getCustomRepository(AgendamentosRepository)
    
    /* - - - - -  Agendamento de exames - - - - - */
    const vagaExamesRepository = getCustomRepository(VagaExamesRepository)
    const filaExamesRepository = getCustomRepository(FilaExamesRepository)

    const examsWithVacancies = await vagaExamesRepository.find({
      disponivel: MoreThan(0),
    });

    examsWithVacancies.map(async (vacancy) => {
      let qtd_vacancies = vacancy.disponivel;

      const requests = await filaExamesRepository.find({
        exame_id: vacancy.exame_id,
      });

      do {
        const firstRequest = requests.shift();

        if (firstRequest) {
          await filaExamesRepository.delete(firstRequest);
          await vagaExamesRepository.update(vacancy.id, { disponivel: --qtd_vacancies });

          const schedule = agendamentoRepository.create({
            paciente_id: firstRequest.paciente_id,
            vaga_id: vacancy.id,
            type: "exame",
          })

          await agendamentoRepository.save(schedule);
        } else {
          break;
        }
      } while(qtd_vacancies > 0);
    })

    
    return response.status(201).json({ message: "ok"});
  }
}

export { AgendamentoController }
