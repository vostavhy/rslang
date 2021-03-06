import { drawPage } from '../app';
import { audioCallView } from '../audiocall-game/view';
import { dictionaryView } from '../dictionary/view';
import SprintView from '../sprint-game/SprintView';
import StatisticController from '../statistic/StatisticController';
import StatisticView from '../statistic/StatisticView';

export async function mainView(): Promise<HTMLDivElement> {
  const response = await fetch('https://raw.githubusercontent.com/vostavhy/landings/dev/.links');
  const link = await response.text();
  console.log(link);

  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__main');
  page.innerHTML = `
    <section class="section section-intro">
      <div class="wrapper wrapper-intro">
        <h1 class="section__title">RS Lang - выучи английский играючи!</h1>
        <div class="intro">
          <div class="intro__text">
          Занимаясь в нашем приложение по 45 минут в день, 
          уже через месяц Вы будете знать более 3 тысяч слов!
          </div>
        </div>
      </div>
    </section>

    <section class="section section-advantages">
      <div class="wrapper wrapper-advantages">
        <h1 class="section__title">Наши преимущества</h1>
        <div class="advantages">
          <div class="advantage advantage-dictionary">
            <h3 class="advantage__title">Электронный учебник</h3>
            <p class="advantage__text">Авторизованный пользователь может добавлять сложные слова в словарь</p>
          </div>
          <div class="advantage advantage-sprint">
            <h3 class="advantage__title">Игра спринт</h3>
            <p class="advantage__text">Попробуй вспомнить правильный перевод слова!</p>
          </div>
          <div class="advantage advantage-audio-call">
            <h3 class="advantage__title">Игра аудиовызов</h3>
            <p class="advantage__text">Попробуй на слух правильно составить предложение!</p>
          </div>
          <div class="advantage advantage-statistic">
            <h3 class="advantage__title">Статистика</h3>
            <p class="advantage__text">Авторизованный пользователь может просматривать свою статистику по изученным словам</p>
          </div>
        </div>
      </div>            
    </section>

    <section class="section section-video">
      <div class="wrapper wrapper-video">
        <h1 class="section__title">Знакомство с приложением</h1>
        <div class="video">
          <iframe width="100%" height="100%" src="${link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
          </iframe>
        </div>
      </div>      
    </section>
  `;

  const advantages = page.querySelectorAll('.advantage');
  for (const advantage of advantages) {
    advantage.addEventListener('click', async (event) => {
      const target = event.currentTarget as Element;
      if (target.matches('.advantage-dictionary')) {
        await drawPage(dictionaryView);
      }
      if (target.matches('.advantage-sprint')) {
        const sprint = new SprintView();
        await drawPage(sprint.sprintView);
      }
      if (target.matches('.advantage-audio-call')) {
        await drawPage(audioCallView);
      }
      if (target.matches('.advantage-statistic')) {
        const statistic = new StatisticView();
        const statisticController = new StatisticController();
        await statisticController.getUserData();
        await drawPage(statistic.statisticView);
        statisticController.updatePage();
      }
    });
  }
  return page;
}
