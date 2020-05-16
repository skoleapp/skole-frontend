import { useState, useEffect, SyntheticEvent } from "react";
import { Box } from "@material-ui/core";

  interface Props  {
    onConfirm: (comment: { text: string, emoji: string }) => void;
    onOpen: () => void;
    onUpdate?: () => void;
  };

  export const  HighlightTip: React.FC<Props> = ({ onConfirm, onOpen, onUpdate }) => {
    const [state, setState] =  useState({
      compact: true,
      text: "",
      emoji: ""
    });

    const { compact, text, emoji } = state;

    useEffect(() => {
        onUpdate()
    }, [compact])

    const handleClick = () => {
        onOpen();
        setState({ ...state, compact: false });
      }

      const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        onConfirm({ text, emoji });
      }

      return (
        <Box>
          {compact ? (
            <Box
              onClick={handleClick}
            >
              Add highlight
            </Box>
          ) : (
            {/* Comment form here */}
          )}
        </Box>
      );
    }
  }
