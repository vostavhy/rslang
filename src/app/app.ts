import { audioCallView } from './audiocall-game/view';
import { loginView } from './authorization/view';
import { dictionaryView, i, pageNum } from './dictionary/view';
import { mainView } from './main/view';
import SprintView from './sprint-game/SprintView';
import SprintController from './sprint-game/SprintController';
import { Menu } from './abstracts';
import { drawUserInfo } from './authorization/controller';
import { teamView } from './team/view';
import { getWords } from './audiocall-game/startGame';
import StatisticView from './statistic/StatisticView';
import StatisticController from './statistic/StatisticController';

export class App {
  async start() {
    const body: HTMLBodyElement = document.getElementsByTagName('body')[0] as HTMLBodyElement;

    // отрисовка меню в хедере
    const header: HTMLDivElement = document.createElement('header') as HTMLDivElement;
    header.classList.add('header');
    header.innerHTML = `
      <span class="menu">${Menu.rsLang}</span>
      <span class="menu">${Menu.dictionary}</span>
      <span class="menu">${Menu.sprint}</span>
      <span class="menu">${Menu.audioCall}</span>
      <span class="menu">${Menu.statistic}</span>
      <span class="menu">${Menu.command}</span>
      <span class="menu login">${Menu.login}</span>
    `;

    // отрисовка футера
    const footer: HTMLDivElement = document.createElement('footer') as HTMLDivElement;
    footer.classList.add('footer');
    footer.innerHTML = `
    <div class="footer-wrapper">      
      <p class="year">© 2022</p>
      <div class="footer-info">        
        <a href="https://github.com/Tatsiana-Bivoina" class="github-user" target="_blank" rel="noopener">@Tatsiana-Bivoina</a>
        <a href="https://github.com/katesoo" class="github-user" target="_blank" rel="noopener">@katesoo</a>
        <a href="https://github.com/vostavhy" class="github-user" target="_blank" rel="noopener">@vostavhy</a>
      </div>
      <a href="https://rs.school/" class="rss-logo" target="_blank" rel="noopener"></a>
    </div>    
    `;

    // отрисовка содержимого страницы
    const main: HTMLDivElement = document.createElement('main') as HTMLDivElement;
    main.classList.add('page');

    body.append(header);
    body.append(main);
    body.append(footer);

    // отрисовка первоначального контента
    await drawPage(mainView);

    // отрисовка приветствия, если есть данные о пользователе в local storage
    drawUserInfo();

    // отрисовка контента в зависимости от нажатой кнопки
    header.addEventListener('click', async (e) => {
      const target = e.target as Element;
      switch (target.textContent) {
        case Menu.rsLang:
          await drawPage(mainView);
          break;
        case Menu.audioCall:
          document.querySelector('.page__dictionary')
            ? await getWords(Number(i), pageNum)
            : await drawPage(audioCallView);
          break;
        case Menu.sprint:
          const sprint = new SprintView();
          const sprintController = new SprintController();
          if (document.querySelector('.page__dictionary')) {
            await sprintController.getWordsCollection(i, pageNum.toString());
            await drawPage(sprint.sprintViewFromDictionary);
            sprint.sprintGameView();
            sprintController.startGame();
          } else {
            await drawPage(sprint.sprintView);
            await sprintController.chooseLevel();
          }
          await sprintController.toggleFullScreen();
          await sprintController.closeGame();
          break;
        case Menu.dictionary:
          await drawPage(dictionaryView);
          break;
        case Menu.team:
          await drawPage(teamView);
          break;
        case Menu.login:
          await drawPage(loginView);
          break;
        case Menu.statistic:
          const statistic = new StatisticView();
          const statisticController = new StatisticController();
          await statisticController.getUserData();
          await drawPage(statistic.statisticView);
          if (localStorage.getItem('name')) {
            statisticController.updatePage();
          }
          break;
      }
    });
  }
}

export async function drawPage(view: () => Promise<HTMLDivElement>): Promise<void> {
  const contentHTML = await view();
  const content = document.querySelector('.page') as HTMLDivElement;
  content.innerHTML = '';
  content.appendChild(contentHTML);
}
