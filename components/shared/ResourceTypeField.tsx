import { FormikProps } from 'formik';
import React from 'react';
import { ResourceType } from '../../interfaces';
import { useAutoCompleteField } from '../../utils';

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const ResourceTypeField: React.FC<FormikProps<any>> = props => {
  const { resourceTypes, resourceType } = props.initialValues;
  const options = resourceTypes;
  const selectedResourceType = resourceTypes.find((r: ResourceType) => r.name === resourceType);
  const initialValue = (selectedResourceType && selectedResourceType.name) || '';
  const dataKey = 'resourceType';
  const fieldName = 'resourceType';
  const label = 'Resource Type';

  const { renderAutoCompleteField } = useAutoCompleteField({
    ...props,
    options,
    initialValue,
    dataKey,
    fieldName,
    label
  });

  return renderAutoCompleteField;
};
