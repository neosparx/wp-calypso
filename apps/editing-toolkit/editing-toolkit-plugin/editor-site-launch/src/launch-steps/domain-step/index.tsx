/**
 * External dependencies
 */
import * as React from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import DomainPicker from '@automattic/domain-picker';
import type { DomainSuggestions } from '@automattic/data-stores';
import { Title, SubTitle, ActionButtons, BackButton, NextButton } from '@automattic/onboarding';
import { recordTracksEvent } from '@automattic/calypso-analytics';

/**
 * Internal dependencies
 */
import LaunchStepContainer, { Props as LaunchStepProps } from '../../launch-step';
import { LAUNCH_STORE } from '../../stores';
import { hooks as launchHooks } from '@automattic/launch';

import { FLOW_ID } from '../../constants';
import './styles.scss';

const DomainStep: React.FunctionComponent< LaunchStepProps > = ( { onPrevStep, onNextStep } ) => {
	const { plan, domain } = useSelect( ( select ) => select( LAUNCH_STORE ).getState() );
	const { currentDomainName } = launchHooks.useSite();
	const domainSearch = launchHooks.useDomainSearch();

	const {
		setDomain,
		unsetDomain,
		setDomainSearch,
		unsetPlan,
		confirmDomainSelection,
	} = useDispatch( LAUNCH_STORE );

	const handleNext = () => {
		confirmDomainSelection();
		onNextStep?.();
	};

	const handlePrev = () => {
		onPrevStep?.();
	};

	const handleDomainSelect = ( suggestion: DomainSuggestions.DomainSuggestion ) => {
		confirmDomainSelection();
		setDomain( suggestion );
		if ( plan?.isFree ) {
			unsetPlan();
		}
	};

	const handleExistingSubdomainSelect = () => {
		unsetDomain();
	};

	const trackDomainSearchInteraction = ( query: string ) => {
		recordTracksEvent( 'calypso_newsite_domain_search_blur', {
			flow: FLOW_ID,
			query,
			where: 'editor_domain_modal',
		} );
	};

	return (
		<LaunchStepContainer>
			<div className="nux-launch-step__header">
				<div>
					<Title>{ __( 'Choose a domain', 'full-site-editing' ) }</Title>
					<SubTitle>
						{ __( 'Free for the first year with any paid plan.', 'full-site-editing' ) }
					</SubTitle>
				</div>
				<ActionButtons sticky={ false }>
					<NextButton onClick={ handleNext } disabled={ ! domainSearch } />
				</ActionButtons>
			</div>
			<div className="nux-launch-step__body">
				<DomainPicker
					analyticsFlowId={ FLOW_ID }
					initialDomainSearch={ domainSearch }
					onSetDomainSearch={ setDomainSearch }
					onDomainSearchBlur={ trackDomainSearchInteraction }
					currentDomain={ domain?.domain_name || currentDomainName }
					existingSubdomain={ currentDomainName }
					onDomainSelect={ handleDomainSelect }
					onExistingSubdomainSelect={ handleExistingSubdomainSelect }
					analyticsUiAlgo="editor_domain_modal"
					segregateFreeAndPaid
				/>
			</div>
			<div className="nux-launch-step__footer">
				<ActionButtons sticky={ true }>
					<BackButton onClick={ handlePrev } />
					<NextButton onClick={ handleNext } disabled={ ! domainSearch } />
				</ActionButtons>
			</div>
		</LaunchStepContainer>
	);
};

export default DomainStep;
