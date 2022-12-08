/**
 * Kinde Management API
 * Provides endpoints to manage your Kinde Businesses
 *
 * The version of the OpenAPI document: 1.1.0
 * Contact: support@kinde.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
 * The CreateUserRequestIdentitiesInnerDetails model module.
 * @module model/CreateUserRequestIdentitiesInnerDetails
 * @version 1.1.0
 */
class CreateUserRequestIdentitiesInnerDetails {
    /**
     * Constructs a new <code>CreateUserRequestIdentitiesInnerDetails</code>.
     * @alias module:model/CreateUserRequestIdentitiesInnerDetails
     */
    constructor() {
        CreateUserRequestIdentitiesInnerDetails.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) {}

    /**
     * Constructs a <code>CreateUserRequestIdentitiesInnerDetails</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateUserRequestIdentitiesInnerDetails} obj Optional instance to populate.
     * @return {module:model/CreateUserRequestIdentitiesInnerDetails} The populated <code>CreateUserRequestIdentitiesInnerDetails</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new CreateUserRequestIdentitiesInnerDetails();

            if (data.hasOwnProperty('email')) {
                obj['email'] = ApiClient.convertToType(data['email'], 'String');
            }
        }
        return obj;
    }
}

/**
 * @member {String} email
 */
CreateUserRequestIdentitiesInnerDetails.prototype['email'] = undefined;

export default CreateUserRequestIdentitiesInnerDetails;
