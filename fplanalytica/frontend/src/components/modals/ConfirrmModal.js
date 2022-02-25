import React from "react";
import { Fragment } from "react";

const ConfirmModal = ({
  text,
  title,
  id,
  body,
  onConfirm,
  onConfirmParams,
  btnType,
}) => {
  return (
    <Fragment>
      <button
        type="button"
        class={`btn btn-${btnType}`}
        data-bs-toggle="modal"
        data-bs-target={`#${id}`}
      >
        {text}
      </button>

      <div
        class="modal fade"
        id={`${id}`}
        tabindex="-1"
        aria-labelledby="leagueAdminChangeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                {title}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">{body}</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={(e) => onConfirm(...onConfirmParams)}
                data-bs-dismiss="modal"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmModal;
