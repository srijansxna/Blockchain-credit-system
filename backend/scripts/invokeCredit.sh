#!/bin/bash
echo "INVOKE SCRIPT CALLED WITH: $@"
# Invokes Fabric chaincode using peer CLI
# Arguments:
# 1 = loanId
# 2 = score_commitment
# 3 = approval_status
# 4 = timestamp

set -e

LOAN_ID=$1
COMMITMENT=$2
STATUS=$3
TIMESTAMP=$4

# Move to Fabric test-network
cd ~/fabric-samples/test-network

# Fabric CLI environment (Org1)
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer chaincode invoke \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls \
  --cafile $PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  -C mychannel \
  -n credit-app \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles $PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles $PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
  --waitForEvent \
  -c "{\"function\":\"storeApprovedCredit\",\"Args\":[\"$LOAN_ID\",\"$COMMITMENT\",\"$STATUS\",\"$TIMESTAMP\"]}"


