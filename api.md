# consumer API

interface WoT {
    Promise<sequence<ConsumedThing>> discover(ThingFilter filter);
    Promise<ConsumedThing>           consumeDescription(object td);
    Promise<ConsumedThing>           consumeDescriptionUri(DOMString uri);
};
