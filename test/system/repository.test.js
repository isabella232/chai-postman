/**
 * @fileOverview This test specs runs tests on the package.json file of repository. It has a set of strict tests on the
 * content of the file as well. Any change to package.json must be accompanied by valid test case in this spec-sheet.
 */
const _ = require('lodash'),
    fs = require('fs'),
    yml = require('js-yaml'),
    expect = require('chai').expect,
    parseIgnore = require('parse-gitignore');

describe('project repository', function () {
    describe('package.json', function () {
        let content,
            json;

        try {
            content = fs.readFileSync('./package.json').toString();
            json = JSON.parse(content);
        }
        catch (e) {
            console.error(e);
            content = '';
            json = {};
        }

        it('must have readable JSON content', function () {
            expect(content).to.be.ok;
            expect(json).to.not.eql({});
        });

        describe('package.json JSON data', function () {
            it('must have valid name, description and author', function () {
                expect(json).to.have.property('name', 'chai-postman');
                expect(json).to.have.property('description', 'A Chai plugin for Postman assertions');
                expect(json).to.have.property('author', 'Postman Inc.');
                expect(json).to.have.property('license', 'Apache-2.0');
                expect(json).to.have.property('homepage', 'https://github.com/postmanlabs/chai-postman#readme');
                expect(json.bugs).to.eql({
                    url: 'https://github.com/postmanlabs/chai-postman/issues',
                    email: 'help@postman.com'
                });

                expect(json).to.have.property('repository');
                expect(json.repository).to.eql({
                    type: 'git',
                    url: 'git+https://github.com/postmanlabs/chai-postman.git'
                });

                expect(json).to.have.property('keywords');
                expect(json.keywords).to.eql(['chai', 'chai-plugin', 'postman']);

                expect(json).to.have.property('engines');
                expect(json.engines).to.eql({ node: '>=10' });
            });

            it('must have a valid version string in form of <major>.<minor>.<revision>', function () {
                // eslint-disable-next-line max-len, security/detect-unsafe-regex
                expect(json.version).to.match(/^((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?(?:\+([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/);
            });
        });

        describe('devDependencies', function () {
            it('should exist', function () {
                expect(json.devDependencies).to.be.an('object');
            });

            it('should point to a valid semver', function () {
                Object.keys(json.devDependencies).forEach(function (dependencyName) {
                    // eslint-disable-next-line security/detect-non-literal-regexp
                    expect(json.devDependencies[dependencyName]).to.match(new RegExp('((\\d+)\\.(\\d+)\\.(\\d+))(?:-' +
                        '([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?(?:\\+([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?$'));
                });
            });
        });

        describe('main entry script', function () {
            it('must point to a valid file', function (done) {
                expect(json.main).to.equal('index.js');
                fs.stat(json.main, done);
            });
        });
    });

    describe('README.md', function () {
        it('must exist', function (done) {
            fs.stat('./README.md', done);
        });

        it('must have readable content', function () {
            expect(fs.readFileSync('./README.md').toString()).to.be.ok;
        });
    });

    describe('LICENSE.md.md', function () {
        it('must exist', function (done) {
            fs.stat('./LICENSE.md', done);
        });

        it('must have readable content', function () {
            expect(fs.readFileSync('./LICENSE.md').toString()).to.be.ok;
        });
    });

    describe('.ignore files', function () {
        var gitignorePath = '.gitignore',
            npmignorePath = '.npmignore',
            npmignore = parseIgnore(fs.readFileSync(npmignorePath)),
            gitignore = parseIgnore(fs.readFileSync(gitignorePath));

        describe(gitignorePath, function () {
            it('must exist', function (done) {
                fs.stat(gitignorePath, done);
            });

            it('must have valid content', function () {
                expect(_.isEmpty(gitignore)).to.not.be.ok;
            });
        });

        describe(npmignorePath, function () {
            it('must exist', function (done) {
                fs.stat(npmignorePath, done);
            });

            it('must have valid content', function () {
                expect(_.isEmpty(npmignore)).to.not.be.ok;
            });
        });

        it('.gitignore coverage must be a subset of .npmignore coverage', function () {
            expect(_.intersection(gitignore, npmignore)).to.eql(gitignore);
        });
    });

    describe('.eslintrc', function () {
        it('must exist', function (done) {
            fs.stat('./.eslintrc', done);
        });

        it('must have readable content', function () {
            expect(fs.readFileSync('./.eslintrc').toString()).to.be.ok;
        });
    });

    describe('.gitattributes', function () {
        it('must exist', function (done) {
            fs.stat('./.gitattributes', done);
        });

        it('must have readable content', function () {
            expect(fs.readFileSync('./.gitattributes').toString()).to.be.ok;
        });
    });

    describe('CHANGELOG.yaml', function () {
        it('should exist', function (done) {
            fs.stat('./CHANGELOG.yaml', done);
        });

        it('should have readable content', function () {
            expect(yml.safeLoad(fs.readFileSync('./CHANGELOG.yaml')), 'not a valid yaml').to.be.ok;
        });
    });
});
