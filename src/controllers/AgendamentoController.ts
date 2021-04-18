import { Request, Response } from "express";
import { getCustomRepository, MoreThan } from "typeorm";
import { AgendamentosRepository } from "../repositories/AgendamentoRepository";
import { FilaConsultasRepository } from "../repositories/FilaConsultasRepository";
import { FilaExamesRepository } from "../repositories/FilaExamesRepository";
import { VagaConsultasRepository } from "../repositories/VagaConsultasRepository";
import { VagaExamesRepository } from "../repositories/VagaExamesRepository";

class AgendamentoController {
  async toSchedule() {
    const agendamentoRepository = getCustomRepository(AgendamentosRepository)

    /* - - - - -  Agendamento de exames - - - - - */
    const vagaExamesRepository = getCustomRepository(VagaExamesRepository)
    const filaExamesRepository = getCustomRepository(FilaExamesRepository)

    const examsWithVacancies = await vagaExamesRepository.find({
      where: {
        disponivel: MoreThan(0)
      },
      order: {
        dataExame: "ASC"
      }
    });

    for (const vacancy of examsWithVacancies) {
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
    }

    /* - - - - -  Agendamento de consultas - - - - - */
    const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository)
    const filaConsultasRepository = getCustomRepository(FilaConsultasRepository)

    const consultationWithVacancies = await vagaConsultasRepository.find({
      where: {
        disponivel: MoreThan(0)
      },
      order: {
        dataConsulta: "ASC"
      }
    });

    for (const vacancy of consultationWithVacancies) {
      let qtd_vacancies = vacancy.disponivel;

      const requests = await filaConsultasRepository.find({
        consulta_id: vacancy.consulta_id,
      });

      do {
        const firstRequest = requests.shift();

        if (firstRequest) {
          await filaConsultasRepository.delete(firstRequest);
          await vagaConsultasRepository.update(vacancy.id, { disponivel: --qtd_vacancies });

          const schedule = agendamentoRepository.create({
            paciente_id: firstRequest.paciente_id,
            vaga_id: vacancy.id,
            type: "consulta",
          })

          await agendamentoRepository.save(schedule);
        } else {
          break;
        }
      } while(qtd_vacancies > 0);
    }
  }
}

export { AgendamentoController }
