import { beproNetwork } from "../../interfaces";
import Numbers from "../../utils/Numbers";
import _ from "lodash";
import IContract from '../IContract';
import ERC20Contract from '../ERC20/ERC20Contract';


const beproAddress = "0xCF3C8Be2e2C42331Da80EF210e9B1b307C03d36A";

/**
 * BEPRONetwork Object
 * @constructor BEPRONetwork
 * @param {Web3} web3
 * @param {Address} contractAddress ? (opt)
 */

class BEPRONetwork extends IContract{
	constructor(params) {
		super({abi : beproNetwork, ...params});
	}

	  /**
     * @override 
     */
	__assert = async () => {
        if(!this.getAddress()){
            throw new Error("Contract is not deployed, first deploy it and provide a contract address");
        }
        /* Use ABI */
        this.params.contract.use(beproNetwork, this.getAddress());

        /* Set Token Address Contract for easy access */
        this.params.ERC20Contract = new ERC20Contract({
            web3: this.web3,
            contractAddress: beproAddress,
            acc : this.acc
        });

        /* Assert Token Contract */
        await this.params.ERC20Contract.__assert();
	}

    /**
	 * @function getIssuesByAddress
	 * @description Get Open Issues Available
	 * @param {Address} address
	 * @returns {Integer | Array}
	*/
	async getIssuesByAddress(address) {
		let res = await this.params.contract
		.getContract()
		.methods.getIssuesByAddress(address)
		.call();

        return res.map(r => parseInt(r))
    }

    /**
	 * @function getAmountofIssuesOpened
	 * @description Get Amount of Issues Opened in the network
	 * @returns {Integer}
	*/
	async getAmountofIssuesOpened() {
		return parseInt(await this.params.contract.getContract().methods.incrementIssueID().call());
    }

	 /**
	 * @function getAmountofIssuesClosed
	 * @description Get Amount of Issues Closed in the network
	 * @returns {Integer}
	*/
	async getAmountofIssuesClosed() {
		return parseInt(await this.params.contract.getContract().methods.closedIdsCount().call());
    }

	/**
	 * @function percentageNeededForApprove
	 * @description Get Amount of Needed for Approve
	 * @returns {Integer}
	*/
	async percentageNeededForApprove() {
		return parseInt(await this.params.contract.getContract().methods.percentageNeededForApprove().call());
    }

	/**
	 * @function percentageNeededForMerge
	 * @description Get Amount of Needed for Merge
	 * @returns {Integer}
	*/
	async percentageNeededForMerge() {
		return parseInt(await this.params.contract.getContract().methods.percentageNeededForMerge().call());
    }

    /**
	 * @function getBEPROStaked
	 * @description Get Total Amount of BEPRO Staked for Tickets in the network
	 * @returns {Integer}
	*/
	async getBEPROStaked() {
		return Numbers.fromDecimals(await this.params.contract.getContract().methods.totalStaked().call(), 18);
    }

	 /**
	 * @function beproVotesStaked
	 * @description Get Total Amount of BEPRO Staked for Tickets in the network
	 * @returns {Integer}
	*/
	async beproVotesStaked() {
		return Numbers.fromDecimals(await this.params.contract.getContract().methods.beproVotesStaked().call(), 18);
    }

	/**
	 * @function COUNCIL_BEPRO_AMOUNT
	 * @description Get Total Amount of BEPRO Staked for Council in the network
	 * @returns {Integer}
	*/
	async COUNCIL_BEPRO_AMOUNT() {
		return Numbers.fromDecimals(await this.params.contract.getContract().methods.COUNCIL_BEPRO_AMOUNT().call(), 18);
    }

		/**
	 * @function OPERATOR_BEPRO_AMOUNT
	 * @description Get Total Amount of BEPRO Staked for Operator in the network
	 * @returns {Integer}
	*/
	async OPERATOR_BEPRO_AMOUNT() {
		return Numbers.fromDecimals(await this.params.contract.getContract().methods.OPERATOR_BEPRO_AMOUNT().call(), 18);
    }

		/**
	 * @function DEVELOPER_BEPRO_AMOUNT
	 * @description Get Total Amount of BEPRO Staked for Developer in the network
	 * @returns {Integer}
	*/
	async DEVELOPER_BEPRO_AMOUNT() {
		return Numbers.fromDecimals(await this.params.contract.getContract().methods.DEVELOPER_BEPRO_AMOUNT().call(), 18);
    }

	/**
	 * @function isIssueApproved
	 * @description Is issue Approved
	 * @param {Integer} issueId
	 * @returns {Bool}
	*/
	async isIssueApproved({issueId}) {
		return await this.params.contract.getContract().methods.isIssueApproved(issueId).call();
    }


	/**
	 * @function isIssueMergeable
	 * @description Is issue mergeable
	 * @param {Integer} issueId
	 * @param {Integer} mergeId
	 * @returns {Bool}
	*/
	async isIssueMergeable({issueId, mergeId}) {
		return await this.params.contract.getContract().methods.isIssueMergeable(issueId, mergeId).call();
    }

	/**
	 * @function isMergeTheOneWithMoreVotes
	 * @description Is issue mergeable
	 * @param {Integer} issueId
	 * @param {Integer} mergeId
	 * @returns {Bool}
	*/
	async isMergeTheOneWithMoreVotes({issueId, mergeId}) {
		return await this.params.contract.getContract().methods.isMergeTheOneWithMoreVotes(issueId, mergeId).call();
    }

	/**
	 * @function getVotesByAddress
	 * @description Get Issue Id Info
	 * @param {Address} address
	 * @returns {Integer} votes
	*/

	async getVotesByAddress({address}) {
		let r = await this.params.contract.getContract().methods.getVotesByAddress(address).call();
		return Numbers.fromDecimals(r, 18);
	}

	/**
	 * @function getIssueById
	 * @description Get Issue Id Info
	 * @param {Integer} issue_id
	 * @returns {Integer} _id
	 * @returns {Integer} beproStaked
	 * @returns {Date} creationDate
	 * @returns {Address} issueGenerator
	 * @returns {Integer} votesForApprove
	 * @returns {Integer} mergeProposalsAmount
	 * @returns {Bool} finalized
	*/

	async getIssueById({issue_id}) {

		let r = await this.__sendTx(
			this.params.contract.getContract().methods.getIssueById(issue_id),
			true
		);

		return {
			_id : Numbers.fromHex(r[0]),
			beproStaked : Numbers.fromDecimals(r[1], 18),
			creationDate : Numbers.fromSmartContractTimeToMinutes(r[2]),
			issueGenerator : r[3],
			votesForApprove : Numbers.fromDecimals(r[4], 18),
			mergeProposalsAmount : parseInt(r[5]),
			finalized: r[6],
		}
	}

	/**
	 * @function getMergeById
	 * @description Get Issue Id Info
	 * @param {Integer} issue_id
	 * @param {Integer} merge_id
	 * @returns {Integer} _id
	 * @returns {Integer} votes
	 * @returns {Address | Array} prAddresses
	 * @returns {Integer | Array} prAmounts
	 * @returns {Address} proposalAddress
	*/

	async getMergeById({issue_id, merge_id}) {

		let r = await this.__sendTx(
			this.params.contract.getContract().methods.getMergeById(issue_id, merge_id),
			true
		);

		return {
			_id : Numbers.fromHex(r[0]),
			votes : Numbers.fromDecimals(r[1], 18),
			prAddresses: r[3],
			prAmounts: r[4] ? r[4].map( a => Numbers.fromDecimals(a, 18)) : 0,
			proposalAddress: r[5],
		}
	}


	/**
	 * @function approveERC20
	 * @description Approve ERC20 Allowance
    */
	approveERC20 = async () => {
		let totalMaxAmount = await this.getERC20Contract().totalSupply();
		return await this.getERC20Contract().approve({
			address: this.getAddress(),
			amount: totalMaxAmount
		})
	}

	/**
	 * @function isApprovedERC20
	 * @description Verify if Approved
    */
	isApprovedERC20 = async ({amount, address}) => {
		return await this.getERC20Contract().isApproved({
			address: address,
			amount: amount,
			spenderAddress : this.getAddress()
		})
	}


	/**
	 * @function lockBepro
	 * @description lock BEPRO for oracles  
	 * @param {integer} beproAmount 
	*/
	async lockBepro({beproAmount,}) {

		if(beproAmount <= 0){
			throw new Error("Bepro Amount has to be higher than 0")
		}

		if(!await this.isApprovedERC20({amount, address})){
			throw new Error("Bepro not approve for tx, first use 'approveERC20'");
		}

		return await this.__sendTx(
			this.params.contract.getContract().methods.lockBepro(beproAmount)
		);
	}

	/**
	 * @function unlockBepro
	 * @description Unlock BEPRO for oracles  
	 * @param {integer} beproAmount 
	 * @param {address} from
	*/
	async unlockBepro({beproAmount, from}) {

		if(beproAmount <= 0){
			throw new Error("Bepro Amount has to be higher than 0")
		}

		return await this.__sendTx(
			this.params.contract.getContract().methods.unlockBepro(beproAmount, from)
		);
	}

	/**
	 * @function delegateOracles
	 * @description Delegated Oracles to others  
	 * @param {integer} beproAmount 
	 * @param {address} delegatedTo
	*/
	async delegateOracles({beproAmount, delegatedTo}) {

		if(beproAmount <= 0){
			throw new Error("Bepro Amount has to be higher than 0")
		}

		return await this.__sendTx(
			this.params.contract.getContract().methods.unlockBepro(beproAmount, delegatedTo)
		);
	}

	/**
	 * @function openIssue
	 * @description open Issue 
	 * @param {integer} beproAmount 
	 * @param {address} address
	*/
	async openIssue({beproAmount, address}) {

		if(beproAmount < 0){
			throw new Error("Bepro Amount has to be higher than 0")
		}

		if(!await this.isApprovedERC20({amount, address})){
			throw new Error("Bepro not approve for tx, first use 'approveERC20'");
		}

		return await this.__sendTx(
			this.params.contract.getContract().methods.openIssue(beproAmount)
		);
	}

	/**
	 * @function approveIssue
	 * @description open Issue 
	 * @param {integer} issueId 
	*/
	async approveIssue({issueId}) {
		return await this.__sendTx(
			this.params.contract.getContract().methods.approveIssue(issueId)
		);
	}

	/**
	 * @function approveMerge
	 * @description open Issue 
	 * @param {integer} issueId 
	 * @param {integer} mergeId 
	*/
	async approveMerge({issueId, mergeId}) {
		return await this.__sendTx(
			this.params.contract.getContract().methods.approveMerge(issueId, mergeId)
		);
	}

	/**
	 * @function updateIssue
	 * @description open Issue 
	 * @param {integer} issueID
	 * @param {integer} beproAmount 
	 * @param {address} address
	*/
	async updateIssue({issueID, beproAmount, address}) {

		if(beproAmount < 0){
			throw new Error("Bepro Amount has to be higher than 0")
		}

		if(!await this.isApprovedERC20({amount, address})){
			throw new Error("Bepro not approve for tx, first use 'approveERC20'");
		}

		return await this.__sendTx(
			this.params.contract.getContract().methods.updateIssue(issueID, beproAmount, address)
		);
	}

	/**
	 * @function proposeIssueMerge
	 * @description Propose Merge of Issue
	 * @param {integer} issueID 
	 * @param {address | Array} prAddresses
	 * @param {address | Integer} prAmounts
	*/
	async proposeIssueMerge({issueID, prAddresses, prAmounts}) {
		if(prAddresses.length != prAmounts.length){
			throw new Error("prAddresses dont match prAmounts size")
		}
		return await this.__sendTx(
			this.params.contract.getContract().methods.proposeIssueMerge(issueID, prAddresses, prAmounts)
		);
	}

	/**
	 * @function closeIssue
	 * @description close Issue 
	 * @param {integer} issueID 
	 * @param {integer} mergeID
	*/
	async closeIssue({issueID, mergeID}) {
		return await this.__sendTx(
			this.params.contract.getContract().methods.closeIssue(issueID, mergeID)
		);
	}


	deploy = async ({tokenAddress, callback}) => {
		let params = [tokenAddress];
		let res = await this.__deploy(params, callback);
		this.params.contractAddress = res.contractAddress;
		/* Call to Backend API */
		await this.__assert();
		return res;
	};

	getERC20Contract = () => this.params.ERC20Contract;

}

export default BEPRONetwork;