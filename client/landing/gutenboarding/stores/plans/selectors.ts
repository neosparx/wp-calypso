/**
 * External dependencies
 */
import { getPlan, getPlanPath } from '../../../../lib/plans';

/**
 * Internal dependencies
 */
import { State, supportedPlanSlugs } from './reducer';
import { planFeatures, planDetails } from './plans-data';
import { defaultPaidPlan, freePlan } from './constants';

function getFortifiedPlan( slug: string | undefined ) {
	if ( ! slug ) {
		return undefined;
	}
	return { ...planFeatures[ slug ], ...getPlan( slug ) };
}

export const getSelectedPlan = ( state: State ) => getFortifiedPlan( state.selectedPlanSlug );
export const getDefaultPlan = ( state: State, hasPaidDomain: boolean ) =>
	hasPaidDomain ? getFortifiedPlan( defaultPaidPlan ) : getFortifiedPlan( freePlan );
export const getSupportedPlans = ( state: State ) =>
	state.supportedPlanSlugs.map( getFortifiedPlan );
export const getPlanByPath = ( state: State, path: string | undefined ) =>
	getFortifiedPlan( supportedPlanSlugs.find( ( slug ) => getPlanPath( slug ) === path ) );
export const getPlansDetails = () => planDetails;
