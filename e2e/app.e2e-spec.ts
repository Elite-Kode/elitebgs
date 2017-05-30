import { ElitebgsPage } from './app.po';

describe('elitebgs App', () => {
  let page: ElitebgsPage;

  beforeEach(() => {
    page = new ElitebgsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
