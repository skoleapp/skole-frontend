import { FormikProps } from 'formik';
import React from 'react';
import { ResourceType } from '../../interfaces';
import { useAutoCompleteField } from '../../utils';

interface Props extends FormikProps<any> {
  t: (value: string) => any;
}

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const ResourceTypeField: React.FC<Props> = props => {
  const t = props.t;
  const { resourceTypes, resourceType } = props.initialValues;
  const options = resourceTypes;
  const selectedResourceType = resourceTypes.find((r: ResourceType) => r.name === resourceType);
  const initialValue = (selectedResourceType && selectedResourceType.name) || '';
  const dataKey = 'resourceType';
  const fieldName = 'resourceType';
  const label = t('fieldResourceType');

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
