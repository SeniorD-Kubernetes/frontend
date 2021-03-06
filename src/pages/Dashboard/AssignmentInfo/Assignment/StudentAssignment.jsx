import React from 'react';
import { withRouter } from 'react-router';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import sanitizeHtml from 'sanitize-html';
import LanguageTag from 'Components/LanguageTag/LanguageTag';

import './Assignment.scss';
import UploadAssignment from 'Components/UploadAssignment/UploadAssignment';
import Submissions from './SubmissionList/SubmissionList';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const Assignments = ({ assignment, updateParent, match }) => {
  const {
    params: { cid }
  } = match;
  const {
    _id: aid,
    name,
    description,
    dueDate,
    language,
    numAttempts,
    submissions,
    tests
    // supportingFiles
  } = assignment;

  return (
    <div className="assignment">
      <div className="header">
        <h1>{name}</h1>
        <div className="dueDate">
          <h3>Due on: {dayjs(dueDate).format('MMM Do YYYY')}</h3>
          <p>{dayjs(dueDate).fromNow()}</p>
        </div>
      </div>
      <div className="subheader desc">
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(description, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                'h1',
                'h2'
              ])
            })
          }}
        />
      </div>
      <div className="subheader">
        <h3>
          Language:
          <LanguageTag style={{ marginLeft: 15 }} language={language} />
        </h3>
      </div>
      <div className="subheader">
        <h3>Total Number of Attempts: {numAttempts}</h3>
        <p>You have {numAttempts - submissions.length} attempts left.</p>
      </div>
      {/* <div className="subheader">
        <h3>Supporting Files:</h3>
        <a
          className="download-file"
          href="https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf"
          target="_blank"
          download
        >
          {supportingFiles}
        </a>
      </div> */}
      <div className="subheader">
        <h3>Submissions:</h3>
        <Submissions
          submissions={submissions}
          updateParent={updateParent}
          tests={tests}
        />
      </div>
      <UploadAssignment
        disabled={!(numAttempts - submissions.length)}
        updateParent={updateParent}
        cid={cid}
        aid={aid}
      />
      {!(numAttempts - submissions.length) && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          Maximum Submissions Reached
        </div>
      )}
    </div>
  );
};

export default withRouter(Assignments);
