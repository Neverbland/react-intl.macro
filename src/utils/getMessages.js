// @flow
import { type BabelPath } from 'babel-flow-types';
import { type MessageDescriptor } from './type.flow';
import { objectExpressionToObject } from './ast-helper';

export default function getMessages(
  referencePath: BabelPath,
): Array<MessageDescriptor> {
  const properties = referencePath.parentPath.get('arguments.0.properties');
  const messages = properties.map(property => {
    // If we have an id here then the object has been correctly parsed.
    const value = objectExpressionToObject(property.get('value'));
    if (value.id) {
      return value;
    }

    // Otherwise we need to manually gather the properties that we care about.
    const id = property.node.value.properties.find(p => p.key.value === 'id');
    const defaultMessage = property.node.value.properties.find(
      p => p.key.value === 'defaultMessage',
    );
    const description = property.node.value.properties.find(
      p => p.key.value === 'description',
    );

    const message = {};
    if (id && id.value && id.value.value) {
      message.id = id.value.value;
    }
    if (defaultMessage && defaultMessage.value && defaultMessage.value.value) {
      message.defaultMessage = defaultMessage.value.value;
    }
    if (description && description.value && description.value.value) {
      message.description = description.value.value;
    }

    return message;
  });

  return messages;
}
