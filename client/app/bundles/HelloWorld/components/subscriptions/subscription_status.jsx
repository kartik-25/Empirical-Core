import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subscriptionType: this.subscriptionType(),
      userIsContact: this.userIsContact(), };
  }

  userIsContact() {
    if (this.props.subscriptionStatus) {
      return Number(document.getElementById('current-user-id').getAttribute('content')) === this.props.subscriptionStatus.purchaser_id;
    }
    return false;
  }

  getContent() {
    const content = {};
    let image,
      expiration,
      remainingDays;
    if (this.state.subscriptionType !== 'Basic') {
      expiration = moment(this.props.subscriptionStatus.expiration);
      remainingDays = expiration.diff(moment(), 'days');
    }
    let subscriptionType = this.state.subscriptionType;
    if (this.state.subscriptionType === 'Basic') {
      image = 'basic_icon.png';
      content.boxColor = '#00c2a2';
      content.buttonOrDate = <a href="/premium" className="q-button cta-button bg-orange text-white">Learn More About Quill Premium</a>;
      subscriptionType = 'Quill Basic';
    } else if (this.props.subscriptionStatus.expired) {
      content.boxColor = '#ff4542';
      content.buttonOrDate = <button onClick={this.props.showPaymentModal} className="renew-subscription q-button bg-orange text-white cta-button">Renew Subscription</button>;
      content.status = <h2><i className="fa fa-exclamation-triangle" />{`Your ${subscriptionType} Premium subscription has expired`}</h2>;
    } else if (this.state.subscriptionType === 'Teacher') {
      image = 'teacher_premium_icon.png';
      content.boxColor = '#348fdf';
    } else if (this.state.subscriptionType === 'Trial') {
      image = 'teacher_premium_icon.png';
    } else if (this.state.subscriptionType === 'School') {
      content.boxColor = '#9c2bde';
      image = 'school_premium_icon.png';
      if (this.state.userIsContact) {
        content.buttonOrDate = <a href="/premium" className="q-button bg-orange text-white cta-button">Renew School Premium</a>;
      } else {
        content.buttonOrDate = <button>Contact {this.props.subscriptionStatus.contact_name} to Renew</button>;
      }
    }
    content.buttonOrDate = content.buttonOrDate || (<span className="expiration-date">
      <span>Valid Until:</span> <span>{`${expiration.format('MMMM Do, YYYY')}`}</span><span className="time-left-in-days"> | {`${remainingDays} ${pluralize('days', remainingDays)}`}</span>
    </span>);
    content.status = content.status || <h2>{`You have a ${subscriptionType} Premium subscription`}<img src={`https://assets.quill.org/images/shared/${image}`} alt={`${subscriptionType}`} /></h2>;
    return content;
  }

  subscriptionType() {
    if (!this.props.subscriptionStatus) {
      return 'Basic';
    }
    const accountType = this.props.subscriptionStatus.account_type;
    if (this.props.schoolSubscriptionTypes.includes(accountType)) {
      return 'School';
    } else if (this.props.trialSubscriptionTypes.includes(accountType)) {
      return 'Trial';
    }
    return 'Teacher';
  }

  render() {
    const content = this.getContent();
    return (
      <section className="subscription-status">
        <div className="flex-row space-between">
          <div className="box-and-h2 flex-row space-between">
            <div className="box" style={{ backgroundColor: content.boxColor, }} />
            <h2>{content.status}</h2>
          </div>
          {content.buttonOrDate}
        </div>
        <p>
          With Quill School Premium, you will have access to all of Quill’s
          free reports as well as additional advanced reporting. You will also
          be able to view and print reports of your students’ progress. Our
          advanced reports support concept, Common Core, and overall progress
          analysis. <a className="green-link">Here’s more information</a> about your Teacher Premium features.
        </p>
      </section>
    );
  }
}
