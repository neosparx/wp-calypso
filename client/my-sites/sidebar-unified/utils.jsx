const secondaryEl = document.getElementById( 'secondary' );
let lastScrollPosition = 0; // Used for calculating scroll direction.
let sidebarTop = 0; // Current sidebar top position.
let pinnedSidebarTop = true;
let pinnedSidebarBottom = false;
let ticking = false; // Used for Scroll event throttling.

export const handleScroll = () => {
	const windowHeight = window?.innerHeight;
	const secondaryElHeight = secondaryEl?.scrollHeight;
	const masterbarHeight = document.getElementById( 'header' ).getBoundingClientRect().height;

	if (
		! ticking && // Do not run until next requestAnimationFrame
		typeof window !== 'undefined' &&
		window.innerWidth > 660 &&
		secondaryEl !== 'undefined' &&
		secondaryEl !== null &&
		secondaryElHeight + masterbarHeight > windowHeight // Only run when sidebar & masterbar are taller than window height.
	) {
		// Throttle scroll event
		window.requestAnimationFrame( function () {
			const maxScroll = secondaryElHeight + masterbarHeight - windowHeight; // Max sidebar inner scroll.
			const scrollY = -document.body.getBoundingClientRect().top; // Get current scroll position.

			// Check for overscrolling, this happens when swiping up at the top of the document in modern browsers.
			if ( scrollY < 0 ) {
				// Stick the sidebar to the top.
				if ( ! pinnedSidebarTop ) {
					pinnedSidebarTop = true;
					pinnedSidebarBottom = false;
					secondaryEl.style.position = 'fixed';
					secondaryEl.style.top = 0;
					secondaryEl.style.bottom = 0;
				}

				ticking = false;
				return;
			} else if ( scrollY + windowHeight > document.body.scrollHeight - 1 ) {
				// When overscrolling at the bottom, stick the sidebar to the bottom.
				if ( ! pinnedSidebarBottom ) {
					pinnedSidebarBottom = true;
					pinnedSidebarTop = false;

					secondaryEl.style.position = 'fixed';
					secondaryEl.style.top = 'inherit';
					secondaryEl.style.bottom = 0;
				}

				ticking = false;
				return;
			}

			if ( scrollY > lastScrollPosition ) {
				// When a down scroll has been detected.

				if ( pinnedSidebarTop ) {
					pinnedSidebarTop = false;
					sidebarTop = masterbarHeight;

					if ( scrollY > maxScroll ) {
						//In case we have already passed the available scroll of the sidebar, add the current scroll
						sidebarTop += scrollY;
					}

					secondaryEl.style.position = 'absolute';
					secondaryEl.style.top = `${ sidebarTop }px`;
					secondaryEl.style.bottom = 'inherit';
				} else if (
					! pinnedSidebarBottom &&
					scrollY + masterbarHeight > maxScroll + secondaryEl.offsetTop
				) {
					// Pin it to the bottom.
					pinnedSidebarBottom = true;

					secondaryEl.style.position = 'fixed';
					secondaryEl.style.top = 'inherit';
					secondaryEl.style.bottom = 0;
				}
			} else if ( scrollY < lastScrollPosition ) {
				// When a scroll up is detected.

				// If it was pinned to the bottom, unpin and calculate relative scroll.
				if ( pinnedSidebarBottom ) {
					pinnedSidebarBottom = false;

					// Calculate new offset position.
					sidebarTop = scrollY + masterbarHeight - maxScroll;

					secondaryEl.style.position = 'absolute';
					secondaryEl.style.top = `${ sidebarTop }px`;
					secondaryEl.style.bottom = 'inherit';
				} else if ( ! pinnedSidebarTop && scrollY + masterbarHeight < sidebarTop ) {
					// Pin it to the top.
					pinnedSidebarTop = true;
					sidebarTop = masterbarHeight;

					secondaryEl.style.position = 'fixed';
					secondaryEl.style.top = `${ sidebarTop }px`;
					secondaryEl.style.bottom = 'inherit';
				}
			}

			lastScrollPosition = scrollY;

			ticking = false;
		} );
		ticking = true;
	}
};
