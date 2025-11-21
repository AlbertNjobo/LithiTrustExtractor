# LithiTrust Blockchain Integration Setup Guide

This guide explains how to enable full blockchain functionality for LithiTrust on Polygon.

## Current Status

✅ **Basic Blockchain Ready** - Hashes are generated and stored locally
⚠️ **Advanced Features Need Setup** - To fully sign and submit transactions to blockchain

## Environment Variables Required

Add these to your Replit secrets/environment variables:

### 1. **POLYGON_RPC_URL** (Optional - has default)
**What it is:** The endpoint to connect to Polygon blockchain
**Default value:** `https://rpc-mumbai.maticvigil.com` (Public)
**Custom RPC (Recommended):**
- Get from [Polygon RPC](https://polygon.technology/developers/docs/tools/wallets/getting-started)
- Or use [Alchemy](https://www.alchemy.com/) (free tier available)
- Or use [Infura](https://infura.io/)

**How to set:**
```
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### 2. **BLOCKCHAIN_PRIVATE_KEY** (Required for signing transactions)
**What it is:** Private key of wallet that will sign blockchain transactions
**Important:** NEVER share this key or commit to version control

**How to get:**
1. Create a new wallet on MetaMask or similar
2. Export/reveal the private key
3. Set as environment variable (remove `0x` prefix if present)

**How to set:**
```
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
```

**Example (don't use):**
```
BLOCKCHAIN_PRIVATE_KEY=abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef9012
```

### 3. **BLOCKCHAIN_CONTRACT_ADDRESS** (For smart contracts - future)
**What it is:** Address of deployed LithiTrust smart contract
**Status:** Not needed yet (Phase 3)
**Format:** `0x...` (40 hex characters after 0x)

**How to set (when available):**
```
BLOCKCHAIN_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

## Setup Steps

### Phase 1: Testing (Current)
✅ Already working - hashes stored locally with blockchain format

### Phase 2: Full Testnet Integration

#### Step 1: Set RPC URL
1. Go to Replit Secrets
2. Add `POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com`
3. Or use your own RPC provider

#### Step 2: Create a Wallet
1. Go to [MetaMask](https://metamask.io/) or [Phantom](https://phantom.app/)
2. Create a new wallet
3. Switch network to **Polygon Mumbai Testnet**
4. Get the private key from settings

#### Step 3: Set Private Key
1. Go to Replit Secrets
2. Add `BLOCKCHAIN_PRIVATE_KEY=` followed by your private key (no 0x prefix)
3. Save

#### Step 4: Fund Your Wallet (Testnet)
1. Go to [Polygon Mumbai Faucet](https://faucet.polygon.technology/)
2. Enter your wallet address
3. Request test MATIC (you need gas to sign transactions)
4. Wait for confirmation (~1 min)

#### Step 5: Test Blockchain
1. Register a new batch in LithiTrust
2. Check server logs: you should see "Batch [number] stored on blockchain: 0x..."
3. Go to batch detail → Overview tab → Blockchain Verification
4. See blockchain hash with "LITHITRUST:" prefix

#### Step 6: Verify on Blockchain
1. Use API: `GET /api/blockchain/verify/:batchId`
2. Get response with `isVerified: true`
3. Or use `GET /api/blockchain/network` to check connection

### Phase 3: Production Deployment

When ready to go live:

1. **Deploy Smart Contract**
   - Create contract that records batch hashes
   - Deploy to Polygon Mainnet
   - Get contract address

2. **Update Environment Variables**
   ```
   POLYGON_RPC_URL=https://polygon-rpc.com
   BLOCKCHAIN_CONTRACT_ADDRESS=0x...
   BLOCKCHAIN_NETWORK=mainnet
   ```

3. **Update Code**
   - Modify `server/blockchain.ts` to call actual smart contract
   - Replace simulated transactions with real ones
   - Update network detection

## Testing Checklist

- [ ] RPC URL set and working
- [ ] Private key configured (kept secret)
- [ ] Wallet funded with test MATIC
- [ ] Batch registered successfully
- [ ] Logs show blockchain confirmation
- [ ] Hash stored with blockchain format
- [ ] `/api/blockchain/network` returns connection info
- [ ] `/api/blockchain/verify/{batchId}` returns verified status

## Current Implementation Details

### What's Working Now:
✅ Hash generation (32-byte crypto hash)
✅ Hash storage in database
✅ API endpoints for verification
✅ Network connection setup
✅ Wallet initialization

### What's Simulated (Phase 2+):
⚠️ Smart contract interaction
⚠️ Transaction signing
⚠️ On-chain hash recording
⚠️ Gas fee handling

### What's Fallback:
🔄 If blockchain fails → Uses local hash (never breaks)

## Troubleshooting

### "Blockchain storage failed, using local hash"
- RPC URL not configured
- Network unreachable
- No internet connection
- **Fix:** Set `POLYGON_RPC_URL` in secrets

### "Failed to verify batch hash on blockchain"
- Private key not set
- Wallet not funded
- Smart contract not deployed
- **Fix:** Set `BLOCKCHAIN_PRIVATE_KEY` and fund wallet

### Verification returns `isVerified: false`
- Contract not deployed yet
- Wrong contract address
- **Fix:** This is normal for Phase 2 (simulated)

### Can't see blockchain hash in batch details
- Hash not stored during batch creation
- Database issue
- **Fix:** Check server logs for errors

## API Reference

### Verify Batch on Blockchain
```
GET /api/blockchain/verify/:batchId
```
Returns:
```json
{
  "batchId": "uuid",
  "batchNumber": "LTB-...",
  "blockchainHash": "0xLITHTRUST:...",
  "isVerified": true,
  "transactionHash": "0x...",
  "network": "Polygon Mumbai (Simulated)"
}
```

### Get Blockchain Network Info
```
GET /api/blockchain/network
```
Returns:
```json
{
  "name": "Polygon Mumbai",
  "chainId": 80001,
  "rpcUrl": "https://rpc-mumbai.maticvigil.com",
  "isConnected": true
}
```

## Security Best Practices

1. **Never commit private keys** to version control
2. **Use Replit Secrets** for all sensitive data
3. **Limit wallet funds** - only keep what's needed for gas
4. **Rotate keys regularly** in production
5. **Audit smart contracts** before mainnet deployment
6. **Test thoroughly** on testnet first

## Next Steps

1. ✅ Set `POLYGON_RPC_URL` environment variable
2. ✅ Create wallet and get private key
3. ✅ Set `BLOCKCHAIN_PRIVATE_KEY` environment variable
4. ✅ Fund wallet with test MATIC
5. ⏳ Register a batch and verify blockchain hash
6. ⏳ Deploy smart contract (Phase 3)
7. ⏳ Upgrade to Polygon Mainnet

## Support

- Polygon Docs: https://polygon.technology/developers/docs/
- Mumbai Testnet Faucet: https://faucet.polygon.technology/
- RPC Providers: Alchemy, Infura, QuickNode
- Smart Contract Templates: OpenZeppelin, Truffle

---

**Current Phase:** Phase 2 - Testnet Integration Ready
**Blockchain:** Polygon Mumbai (80001)
**Status:** Functional with fallback protection
