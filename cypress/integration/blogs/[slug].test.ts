import { urls } from 'utils';

describe('Blog Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.task<string[]>('readdir', 'markdown/en/blogs').then((fileNames) => {
      fileNames.forEach((f) => {
        const slug = f.replace(/\.md$/, '');
        const url = urls.blog(slug);
        cy.visit(url);
        cy.wait(['@userMe']);
        cy.url().should('include', url);
      });
    });
  });
});
