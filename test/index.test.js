const expect = require('chai').expect;
const nock = require('nock');

const getUser = require('./index').getUser;
const response = require('./response');

describe('Get User tests', () => {
  beforeEach(() => {
    nock('https://api.github.com')
      .get('/users/admin')
      .reply(200, response);
  });

  it('Get a user by username', () => {
    return getUser('admin')
      .then(response => {
        //expect an object back
        expect(typeof response).to.equal('object');

        //Test result of name, company and location for the response
        expect(response.user_email).to.equal('evan.nhea@gmail.com')
        // expect(response.company).to.equal('GitHub')
        // expect(response.location).to.equal('San Francisco')
      });
  });
});