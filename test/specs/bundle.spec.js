'use strict';

const helper = require('../fixtures/helper');
const expect = require('chai').expect;
const fs = require('fs');

describe('swagger-cli bundle', () => {

  it('should bundle a single-file API', () => {
    let output = helper.run('bundle', 'test/files/valid/single-file/api.yaml');
    let expectedOutput = fs.readFileSync('test/files/valid/single-file/api.bundled.json', 'utf8');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + '\n');
  });

  it('should bundle a multi-file API', () => {
    let output = helper.run('bundle', 'test/files/valid/multi-file/api.yaml');
    let expectedOutput = fs.readFileSync('test/files/valid/multi-file/api.bundled.json', 'utf8');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + '\n');
  });

  it('should bundle an API with circular references', () => {
    let output = helper.run('bundle', 'test/files/valid/circular-refs/api.yaml');
    let expectedOutput = fs.readFileSync('test/files/valid/circular-refs/api.bundled.json', 'utf8');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + '\n');
  });

  it('should dereference a single-file API (--dereference)', () => {
    let output = helper.run('bundle', '--dereference', 'test/files/valid/single-file/api.yaml');
    let expectedOutput = fs.readFileSync('test/files/valid/single-file/api.dereferenced.json', 'utf8');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + '\n');
  });

  it('should dereference a multi-file API (-r)', () => {
    let output = helper.run('bundle', '-r', 'test/files/valid/multi-file/api.yaml');
    let expectedOutput = fs.readFileSync('test/files/valid/multi-file/api.dereferenced.json', 'utf8');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + '\n');
  });

  it('should fail to dereference an API with circular references', () => {
    let output = helper.run('bundle', '-r', 'test/files/valid/circular-refs/api.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal('Circular $ref pointer found at test/files/valid/circular-refs/api.yaml#/paths/~1thing/get/responses/200/schema\n');
  });

  it('should output to a file (--outfile <file>)', () => {
    let output = helper.run('bundle', '--outfile', 'test/.tmp/bundled.json', 'test/files/valid/single-file/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal('Created test/.tmp/bundled.json from test/files/valid/single-file/api.yaml\n');

    let expectedOutput = fs.readFileSync('test/files/valid/single-file/api.bundled.json', 'utf8');
    let actualOutput = fs.readFileSync('test/.tmp/bundled.json', 'utf8');
    expect(actualOutput).to.equal(expectedOutput);
  });

  it('should output to a file (--outfile=<file>)', () => {
    let output = helper.run('bundle', '--outfile=test/.tmp/bundled.json', 'test/files/valid/multi-file/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal('Created test/.tmp/bundled.json from test/files/valid/multi-file/api.yaml\n');

    let expectedOutput = fs.readFileSync('test/files/valid/multi-file/api.bundled.json', 'utf8');
    let actualOutput = fs.readFileSync('test/.tmp/bundled.json', 'utf8');
    expect(actualOutput).to.equal(expectedOutput);
  });

  it('should output to a file (-o <file>)', () => {
    let output = helper.run('bundle', '-o', 'test/.tmp/bundled.json', 'test/files/valid/circular-refs/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal('Created test/.tmp/bundled.json from test/files/valid/circular-refs/api.yaml\n');

    let expectedOutput = fs.readFileSync('test/files/valid/circular-refs/api.bundled.json', 'utf8');
    let actualOutput = fs.readFileSync('test/.tmp/bundled.json', 'utf8');
    expect(actualOutput).to.equal(expectedOutput);
  });

  it('should use 4-space indent instead of 2-spaces (--format 4)', () => {
    let output = helper.run('bundle', '--format', '4', 'test/files/valid/single-file/api.yaml');
    let expectedOutput = fs.readFileSync('test/files/valid/single-file/api.bundled.4-spaces.json', 'utf8');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + '\n');
  });

  it('should use 4-space indent instead of 2-spaces (--format=4)', () => {
    let output = helper.run('bundle', '--format=4', 'test/files/valid/single-file/api.yaml');
    let expectedOutput = fs.readFileSync('test/files/valid/single-file/api.bundled.4-spaces.json', 'utf8');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + '\n');
  });

  it('should use 4-space indent instead of 2-spaces (-f 4)', () => {
    let output = helper.run('bundle', '-f', '4', 'test/files/valid/single-file/api.yaml');
    let expectedOutput = fs.readFileSync('test/files/valid/single-file/api.bundled.4-spaces.json', 'utf8');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + '\n');
  });

  it('should use all three options together (-rf=4 -o=<file>)', () => {
    let output = helper.run('bundle', '-rf=4', '-o=test/.tmp/dereferenced.json', 'test/files/valid/single-file/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal('Created test/.tmp/dereferenced.json from test/files/valid/single-file/api.yaml\n');

    let expectedOutput = fs.readFileSync('test/files/valid/single-file/api.dereferenced.4-spaces.json', 'utf8');
    let actualOutput = fs.readFileSync('test/.tmp/dereferenced.json', 'utf8');
    expect(actualOutput).to.equal(expectedOutput);
  });

  it('should fail if a $ref is invalid', () => {
    let output = helper.run('bundle', 'test/files/invalid/internal-ref/api.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      'Error resolving $ref pointer "test/files/invalid/internal-ref/api.yaml#/definitions/person". \n' +
      'Token "definitions" does not exist.\n'
    );
  });

  it('should fail if a referenced file does not exist', () => {
    let output = helper.run('bundle', 'test/files/invalid/external-ref/api.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      'Error opening file "test/files/invalid/external-ref/address.yaml" \n' +
      "ENOENT: no such file or directory, open 'test/files/invalid/external-ref/address.yaml'\n"
    );
  });

  it('should output the full error stack in debug mode', () => {
    let output = helper.run('--debug', 'bundle', 'test/files/invalid/external-ref/api.yaml');

    expect(output.stdout).not.to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include(
      'Error opening file "test/files/invalid/external-ref/address.yaml" \n' +
      "ENOENT: no such file or directory, open 'test/files/invalid/external-ref/address.yaml'\n"
    );
    expect(output.stderr).to.include('at ReadFileContext');
  });

});
