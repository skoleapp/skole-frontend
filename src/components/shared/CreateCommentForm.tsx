import React from 'react';
import { Formik, Field } from 'formik';
import { useTranslation } from '../../i18n';
import { StyledForm } from './StyledForm';
import { TextField } from 'formik-material-ui';
import { useDispatch } from 'react-redux';
import { toggleNotification } from '../../actions';
import { useCreateCommentMutation, CreateCommentMutation, CommentObjectType } from '../../../generated/graphql';
import { useForm } from '../../utils';
import { CommentTarget } from '../../types';

interface Props {
    label: string;
    placeholder: string;
    target: CommentTarget;
    appendComments: (comments: CommentObjectType[]) => void;
}

interface CreateCommentFormValues {
    text: string;
    attachment: string;
    course?: string;
    resource?: string;
    resourcePart?: string;
    comment?: string;
}

export const CreateCommentForm: React.FC<Props> = ({ placeholder, target, appendComments }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm } = useForm<CreateCommentFormValues>();

    const onError = (): void => {
        dispatch(toggleNotification(t('notifications:messageError')));
    };

    const onCompleted = ({ createComment }: CreateCommentMutation): void => {
        if (createComment) {
            if (createComment.errors) {
                onError();
            } else if (createComment.comments) {
                dispatch(toggleNotification(t('notifications:messageSubmitted')));
                appendComments(createComment.comments as CommentObjectType[]);
            }
        }
    };

    const [createCommentMutation] = useCreateCommentMutation({ onCompleted, onError });

    const handleSubmit = async (values: CreateCommentFormValues): Promise<void> => {
        await createCommentMutation({ variables: { ...values } });
        setSubmitting(false);
        resetForm();
    };

    const initialValues = {
        text: '',
        attachment: '',
        ...target,
    };

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(): JSX.Element => (
                <StyledForm>
                    <Field
                        name="text"
                        placeholder={placeholder}
                        variant="outlined"
                        component={TextField}
                        fullWidth
                        autoComplete="off"
                    />
                    <input type="submit" value="Submit" />
                </StyledForm>
            )}
        </Formik>
    );
};
