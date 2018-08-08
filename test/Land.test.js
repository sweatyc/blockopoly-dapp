
const { assertRevert } = require('openzeppelin-solidity/test/helpers/assertRevert')

const World = artifacts.require('World')
const Land = artifacts.require('Land')

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('Land', (accounts) => {
  const creator = accounts[0]
  const worldOwner = accounts[1]

  beforeEach(async () => {
    this.world = await World.new()
    this.land = await Land.new(this.world.address)
    await this.world.createAndTransfer(worldOwner, 0, { from: creator })
  })
  
  describe('encodeTokenId', () => {
    it('(0,0,0)', async () => {
      const tokenId = (await this.land.encodeTokenId.call(0, 0, 0)).toNumber()
      tokenId.should.be.equal(0)
    })
    it('(0,1,1)', async () => {
      const tokenId = (await this.land.encodeTokenId.call(0, 1, 1)).toString(16)
      tokenId.should.be.equal('10000000000000000000000000001')
    })
    it('(0,2,4)', async () => {
      const tokenId = (await this.land.encodeTokenId.call(0, 2, 4)).toString(16)
      tokenId.should.be.equal('20000000000000000000000000004')
    })
    it('(0,0,-1)', async () => {
      const tokenId = (await this.land.encodeTokenId.call(0, 0, -1)).toString(16)
      tokenId.should.be.equal('ffffffffffffffffffffffffffff')
    })
    it('(0,-1,-1)', async () => {
      const tokenId = (await this.land.encodeTokenId.call(0, -1, -1)).toString(16)
      tokenId.should.be.equal('ffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    })
    it('(0,-2,-4)', async () => {
      const tokenId = (await this.land.encodeTokenId.call(0, -2, -4)).toString(16)
      tokenId.should.be.equal('fffffffffffffffffffffffffffefffffffffffffffffffffffffffc')
    })
    it('(1,3,-2)', async () => {
      const tokenId = (await this.land.encodeTokenId.call(1, 3, -2)).toString(16)
      tokenId.should.be.equal('10000000000000000000000000003fffffffffffffffffffffffffffe')
    })
    it('(0,1.2,2.9)', async () => {
      const tokenId = (await this.land.encodeTokenId.call(0, 1.2, 3.1)).toString(16)
      tokenId.should.be.equal('10000000000000000000000000003')
    })
  })

  describe('decodeTokenId', () => {
    it('0x0', async () => {
      const data = await this.land.decodeTokenId.call(0x0)
      data[0].toNumber().should.be.equal(0)
      data[1].toNumber().should.be.equal(0)
      data[2].toNumber().should.be.equal(0)
    })
    it('0x20000000000000000000000000004', async () => {
      const data = await this.land.decodeTokenId.call(new BigNumber('0x20000000000000000000000000004'))
      data[0].toNumber().should.be.equal(0)
      data[1].toNumber().should.be.equal(2)
      data[2].toNumber().should.be.equal(4)
    })
    it('0xffffffffffffffffffffffffffff0000000000000000000000000001', async () => {
      const data = await this.land.decodeTokenId.call(new BigNumber('0xffffffffffffffffffffffffffff0000000000000000000000000001'))
      data[0].toNumber().should.be.equal(0)
      data[1].toNumber().should.be.equal(-1)
      data[2].toNumber().should.be.equal(1)
    })
    it('0x2fffffffffffffffffffffffffffdfffffffffffffffffffffffffffa', async () => {
      const data = await this.land.decodeTokenId.call(new BigNumber('0x2fffffffffffffffffffffffffffdfffffffffffffffffffffffffffa'))
      data[0].toNumber().should.be.equal(2)
      data[1].toNumber().should.be.equal(-3)
      data[2].toNumber().should.be.equal(-6)
    })
  })

  describe('create', () => {
    it('creator can create', async () => {
      await this.land.create(0, 0, 0, { from: creator })
      const landExists = await this.land.exists.call(0, 0, 0)
      landExists.should.be.equal(true)
      const landOwner = await this.land.ownerOf.call(0)
      landOwner.should.be.equal(creator)
    })
    it('world owner can create', async () => {
      await this.land.create(0, 0, 0, { from: worldOwner })
      const landExists = await this.land.exists.call(0, 0, 0)
      landExists.should.be.equal(true)
      const landOwner = await this.land.ownerOf.call(0)
      landOwner.should.be.equal(worldOwner)
    })
    it('unauthorized address cannot create', async () => {
      await assertRevert(this.land.create(0, 0, 0, { from: accounts[3] }))
    })
    it('authorized address can create', async () => {
      const recipient = accounts[2]
      await this.land.authorize(recipient, { from: creator })
      await this.land.create(0, 0, 0, { from: accounts[2] })
      const landExists = await this.land.exists.call(0, 0, 0)
      landExists.should.be.equal(true)
      const landOwner = await this.land.ownerOf.call(0)
      landOwner.should.be.equal(recipient)
    })
  })

})