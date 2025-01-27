import { strict as assert } from 'node:assert';
import testUtils, { GLOBAL } from '../test-utils';
import { transformArguments } from './HPEXPIREAT';
import { HASH_EXPIRATION_TIME } from './HEXPIRETIME';

describe('HPEXPIREAT', () => {
  testUtils.isVersionGreaterThanHook([7, 4]);

  describe('transformArguments', () => {
    it('string + number', () => {
      assert.deepEqual(
        transformArguments('key', 'field', 1),
        ['HPEXPIREAT', 'key', '1', 'FIELDS', '1', 'field']
      );
    });

    it('array + number', () => {
      assert.deepEqual(
        transformArguments('key', ['field1', 'field2'], 1),
        ['HPEXPIREAT', 'key', '1', 'FIELDS', '2', 'field1', 'field2']
      );
    });

    it('date', () => {
      const d = new Date();
      assert.deepEqual(
        transformArguments('key', ['field1'], d),
        ['HPEXPIREAT', 'key', d.getTime().toString(), 'FIELDS', '1', 'field1']
      );
    });

    it('with set option', () => {
      assert.deepEqual(
        transformArguments('key', ['field1'], 1, 'XX'),
        ['HPEXPIREAT', 'key', '1', 'XX', 'FIELDS', '1', 'field1']
      );
    });
  });

  testUtils.testWithClient('hpExpireAt', async client => {
    assert.deepEqual(
      await client.hpExpireAt('key', ['field1'], 1),
      [ HASH_EXPIRATION_TIME.FieldNotExists ]
    );
  }, {
    ...GLOBAL.SERVERS.OPEN,
  });
});
