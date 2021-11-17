import React from 'react'

import { SvgIcon } from './SvgIcon'

export const SettingsIcon = () => {
  return (
    <SvgIcon viewBox="0 0 20 20" fill="none">
      <path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.1668 12.5C16.0559 12.7513 16.0228 13.0301 16.0718 13.3005C16.1208 13.5708 16.2497 13.8202 16.4418 14.0166L16.4918 14.0666C16.6468 14.2214 16.7697 14.4052 16.8536 14.6076C16.9375 14.8099 16.9806 15.0268 16.9806 15.2458C16.9806 15.4648 16.9375 15.6817 16.8536 15.884C16.7697 16.0864 16.6468 16.2702 16.4918 16.425C16.337 16.5799 16.1532 16.7029 15.9509 16.7867C15.7486 16.8706 15.5317 16.9138 15.3127 16.9138C15.0936 16.9138 14.8768 16.8706 14.6744 16.7867C14.4721 16.7029 14.2883 16.5799 14.1335 16.425L14.0835 16.375C13.8871 16.1829 13.6376 16.054 13.3673 16.005C13.097 15.956 12.8182 15.989 12.5668 16.1C12.3204 16.2056 12.1101 16.381 11.9621 16.6046C11.814 16.8282 11.7346 17.0902 11.7335 17.3583V17.5C11.7335 17.942 11.5579 18.3659 11.2453 18.6785C10.9328 18.991 10.5089 19.1666 10.0668 19.1666C9.6248 19.1666 9.20088 18.991 8.88832 18.6785C8.57576 18.3659 8.40016 17.942 8.40016 17.5V17.425C8.39371 17.1491 8.30443 16.8816 8.14392 16.6572C7.98341 16.4328 7.75911 16.2619 7.50016 16.1666C7.24882 16.0557 6.97 16.0226 6.69967 16.0716C6.42934 16.1207 6.17989 16.2495 5.9835 16.4416L5.9335 16.4916C5.77871 16.6466 5.59489 16.7695 5.39256 16.8534C5.19023 16.9373 4.97335 16.9805 4.75433 16.9805C4.5353 16.9805 4.31843 16.9373 4.1161 16.8534C3.91377 16.7695 3.72995 16.6466 3.57516 16.4916C3.4202 16.3369 3.29727 16.153 3.2134 15.9507C3.12952 15.7484 3.08635 15.5315 3.08635 15.3125C3.08635 15.0935 3.12952 14.8766 3.2134 14.6742C3.29727 14.4719 3.4202 14.2881 3.57516 14.1333L3.62516 14.0833C3.81728 13.8869 3.94615 13.6375 3.99517 13.3671C4.04418 13.0968 4.01109 12.818 3.90016 12.5666C3.79453 12.3202 3.61913 12.11 3.39555 11.9619C3.17198 11.8138 2.90998 11.7344 2.64183 11.7333H2.50016C2.05814 11.7333 1.63421 11.5577 1.32165 11.2452C1.00909 10.9326 0.833496 10.5087 0.833496 10.0666C0.833496 9.62462 1.00909 9.2007 1.32165 8.88813C1.63421 8.57557 2.05814 8.39998 2.50016 8.39998H2.57516C2.85099 8.39353 3.1185 8.30424 3.34291 8.14374C3.56732 7.98323 3.73826 7.75893 3.8335 7.49998C3.94443 7.24863 3.97752 6.96982 3.9285 6.69949C3.87948 6.42916 3.75061 6.17971 3.5585 5.98331L3.5085 5.93331C3.35354 5.77852 3.2306 5.59471 3.14673 5.39238C3.06286 5.19005 3.01968 4.97317 3.01968 4.75415C3.01968 4.53512 3.06286 4.31824 3.14673 4.11591C3.2306 3.91358 3.35354 3.72977 3.5085 3.57498C3.66328 3.42002 3.8471 3.29709 4.04943 3.21321C4.25176 3.12934 4.46864 3.08617 4.68766 3.08617C4.90669 3.08617 5.12357 3.12934 5.3259 3.21321C5.52823 3.29709 5.71204 3.42002 5.86683 3.57498L5.91683 3.62498C6.11323 3.81709 6.36268 3.94597 6.633 3.99498C6.90333 4.044 7.18215 4.01091 7.4335 3.89998H7.50016C7.74664 3.79434 7.95684 3.61894 8.10491 3.39537C8.25297 3.17179 8.33243 2.9098 8.3335 2.64165V2.49998C8.3335 2.05795 8.50909 1.63403 8.82165 1.32147C9.13421 1.00891 9.55813 0.833313 10.0002 0.833313C10.4422 0.833313 10.8661 1.00891 11.1787 1.32147C11.4912 1.63403 11.6668 2.05795 11.6668 2.49998V2.57498C11.6679 2.84313 11.7474 3.10513 11.8954 3.3287C12.0435 3.55228 12.2537 3.72768 12.5002 3.83331C12.7515 3.94424 13.0303 3.97733 13.3007 3.92832C13.571 3.8793 13.8204 3.75043 14.0168 3.55831L14.0668 3.50831C14.2216 3.35335 14.4054 3.23042 14.6078 3.14655C14.8101 3.06267 15.027 3.0195 15.246 3.0195C15.465 3.0195 15.6819 3.06267 15.8842 3.14655C16.0866 3.23042 16.2704 3.35335 16.4252 3.50831C16.5801 3.6631 16.7031 3.84692 16.7869 4.04925C16.8708 4.25158 16.914 4.46845 16.914 4.68748C16.914 4.90651 16.8708 5.12338 16.7869 5.32571C16.7031 5.52804 16.5801 5.71186 16.4252 5.86665L16.3752 5.91665C16.183 6.11305 16.0542 6.36249 16.0052 6.63282C15.9561 6.90315 15.9892 7.18197 16.1002 7.43331V7.49998C16.2058 7.74645 16.3812 7.95666 16.6048 8.10472C16.8283 8.25279 17.0903 8.33224 17.3585 8.33331H17.5002C17.9422 8.33331 18.3661 8.50891 18.6787 8.82147C18.9912 9.13403 19.1668 9.55795 19.1668 9.99998C19.1668 10.442 18.9912 10.8659 18.6787 11.1785C18.3661 11.4911 17.9422 11.6666 17.5002 11.6666H17.4252C17.157 11.6677 16.895 11.7472 16.6714 11.8952C16.4479 12.0433 16.2725 12.2535 16.1668 12.5V12.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
