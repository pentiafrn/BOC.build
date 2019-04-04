export const getEventTarget = (e) => {
	const safeEvent = e || window.event;
	return safeEvent.target || safeEvent.srcElement || e;
};

export const getEvent = e => e || window.event;
