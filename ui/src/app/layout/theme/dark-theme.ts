import { Theme } from './types';

export const darkTheme: Theme = {
  name: 'dark',
  properties: {
    '--clr-global-app-background': 'hsl(201, 30%, 15%)',
    '--clr-global-selection-color': 'hsl(203, 32%, 29%)',
    '--clr-global-hover-bg-color': 'hsl(201, 31%, 23%)',
    '--clr-close-color--normal': 'hsl(201, 17%, 80%)',
    '--clr-close-color--normal-opacity': '1',
    '--clr-close-color--hover': 'hsl(201, 0%, 100%)',
    '--clr-close-color--hover-opacity': '1',
    '--clr-popover-box-shadow-color': 'hsla(0, 0%, 0%, 0.5)',
    '--clr-link-active-color': 'hsl(198, 65%, 57%)',
    '--clr-link-color': 'hsl(198, 65%, 57%)',
    '--clr-link-hover-color': 'hsl(198, 65%, 57%)',
    '--clr-link-visited-color': 'hsl(228, 55%, 75%)',
    '--clr-theme-alert-font-color': 'hsl(210, 16%, 93%)',
    '--clr-theme-app-alert-font-color': 'hsl(0, 0%, 0%)',
    '--clr-alert-info-bg-color': 'hsl(198, 79%, 28%)',
    '--clr-alert-info-font-color': 'var(--clr-theme-alert-font-color)',
    '--clr-alert-info-border-color': 'transparent',
    '--clr-alert-info-icon-color': 'var(--clr-theme-alert-font-color)',
    '--clr-alert-success-bg-color': 'hsl(122, 45%, 23%)',
    '--clr-alert-success-font-color': 'var(--clr-theme-alert-font-color)',
    '--clr-alert-success-border-color': 'transparent',
    '--clr-alert-success-icon-color': 'var(--clr-theme-alert-font-color)',
    '--clr-alert-danger-bg-color': 'hsl(357, 50%, 35%)',
    '--clr-alert-danger-font-color': 'var(--clr-theme-alert-font-color)',
    '--clr-alert-danger-border-color': 'transparent',
    '--clr-alert-danger-icon-color': 'var(--clr-theme-alert-font-color)',
    '--clr-alert-warning-bg-color': 'hsl(47, 87%, 27%)',
    '--clr-alert-warning-font-color': 'var(--clr-theme-alert-font-color)',
    '--clr-alert-warning-border-color': 'transparent',
    '--clr-alert-warning-icon-color': 'var(--clr-theme-alert-font-color)',
    '--clr-app-alert-info-bg-color': 'hsl(198, 65%, 57%)',
    '--clr-app-alert-info-font-color': 'var(--clr-theme-app-alert-font-color)',
    '--clr-app-alert-info-border-color': 'transparent',
    '--clr-app-alert-info-icon-color': 'var(--clr-theme-app-alert-font-color)',
    '--clr-app-alert-warning-bg-color': 'hsl(49, 98%, 51%)',
    '--clr-app-alert-warning-icon-color': 'var(--clr-theme-app-alert-font-color)',
    '--clr-app-alert-warning-font-color': 'var(--clr-theme-app-alert-font-color)',
    '--clr-app-alert-warning-border-color': 'transparent',
    '--clr-app-alert-danger-bg-color': 'hsl(3, 90%, 62%)',
    '--clr-app-alert-danger-icon-color': 'var(--clr-theme-app-alert-font-color)',
    '--clr-app-alert-danger-font-color': 'var(--clr-theme-app-alert-font-color)',
    '--clr-app-alert-danger-border-color': 'transparent',
    '--clr-alert-action-color': 'hsl(0, 0%, 100%)', // Used for dropdowns on the right side of an alert
    '--clr-alert-action-active-color': 'hsl(0, 0%, 100%)', // Alert dropdowns when they are clicked on
    // '--clr-app-alert-close-icon-color': 'var(--clr-close-color--normal)', // Colors for the 'X' close btn in global alerts
    '--clr-alert-close-icon-opacity': '1',
    '--clr-alert-close-icon-hover-opacity': '1',
    '--clr-app-level-alert-color': 'hsl(0, 0%, 0%)',
    '--clr-app-alert-close-icon-color': 'hsl(0, 0%, 0%)',
    '--clr-badge-font-color-light': 'hsl(0, 0%, 0%)',
    '--clr-badge-font-color-dark': 'hsl(0, 0%, 0%)',
    '--clr-badge-info-bg-color': 'hsl(198, 65%, 57%)',
    '--clr-badge-info-color': 'hsl(0, 0%, 0%)',
    '--clr-badge-success-bg-color': 'hsl(90, 67%, 38%)',
    '--clr-badge-success-color': 'hsl(0, 0%, 0%)',
    '--clr-badge-warning-bg-color': 'hsl(49, 98%, 51%)',
    '--clr-badge-warning-color': 'hsl(0, 0%, 0%)',
    '--clr-badge-danger-bg-color': 'hsl(3, 90%, 62%)',
    '--clr-badge-danger-color': 'hsl(0, 0%, 0%)',
    '--clr-badge-gray-bg-color': 'hsl(211, 10%, 47%)',
    '--clr-badge-purple-bg-color': 'hsl(281, 44%, 62%)',
    '--clr-badge-blue-bg-color': 'hsl(201, 100%, 36%)',
    '--clr-badge-orange-bg-color': 'hsl(31, 100%, 60%)',
    '--clr-badge-light-blue-bg-color': 'hsl(194, 57%, 71%)',
    '--clr-btn-disabled-font-color': 'hsl(0, 0%, 0%)',
    '--clr-btn-outline-disabled-font-color': 'hsl(0, 0%, 100%)',
    '--clr-btn-disabled-bg-color': 'hsl(0, 0%, 100%)',
    '--clr-btn-disabled-border-color': 'hsl(0, 0%, 100%)',
    '--clr-btn-icon-disabled-color': 'var(--clr-btn-outline-disabled-font-color)',
    '--clr-btn-default-color': 'hsl(198, 65%, 57%)', // border-color, color, checked-background-color
    '--clr-btn-default-bg-color': 'transparent', // background-color, disabled-background-color
    '--clr-btn-default-hover-bg-color': 'hsla(0, 0%, 100%, 0.1)', // hover-background-color
    '--clr-btn-default-hover-color': 'hsl(194, 78%, 63%)', // hover-color
    '--clr-btn-default-box-shadow-color': 'hsl(0, 0%, 0%)', // active-box-shadow-color
    '--clr-btn-default-checked-color': 'hsl(0, 0%, 100%)', // checked-color
    '--clr-btn-default-checked-bg-color': 'var(--clr-btn-default-color)',
    '--clr-btn-default-disabled-color': 'var(--clr-btn-outline-disabled-font-color)', // disabled-color
    '--clr-btn-default-disabled-border-color': 'var(--clr-btn-disabled-border-color)', // disabled-border-color
    '--clr-btn-default-outline-color': 'hsl(198, 65%, 57%)', // border-color, color, checked-background-color
    '--clr-btn-default-outline-bg-color': 'transparent', // background-color, disabled-background-color
    '--clr-btn-default-outline-hover-bg-color': 'hsla(0, 0%, 100%, 0.1)', // hover-background-color
    '--clr-btn-default-outline-hover-color': 'hsl(194, 78%, 63%)', // hover-color
    '--clr-btn-default-outline-box-shadow-color': 'hsl(0, 0%, 0%)', // active-box-shadow-color
    '--clr-btn-default-outline-checked-color': 'hsl(0, 0%, 100%)', // checked-color
    '--clr-btn-default-outline-checked-bg-color': 'var(--clr-btn-default-outline-color)', // checked-color
    '--clr-btn-default-outline-disabled-color': 'var(--clr-btn-outline-disabled-font-color)', // disabled-color
    '--clr-btn-default-outline-disabled-border-color': 'var(--clr-btn-disabled-border-color)', // disabled-border-color
    '--clr-btn-default-outline-disabled-checked-color': 'var(--clr-btn-disabled-bg-color)',
    '--clr-btn-primary-color': 'hsl(0, 0%, 0%)', // color, checked-background-color
    '--clr-btn-primary-bg-color': 'hsl(198, 65%, 57%)', // background-color, disabled-background-color
    '--clr-btn-primary-border-color': 'hsl(198, 65%, 57%)', // border-color
    '--clr-btn-primary-hover-bg-color': 'hsl(194, 78%, 63%)', // hover-background-color
    '--clr-btn-primary-hover-color': 'hsl(0, 0%, 0%)', // hover-color
    '--clr-btn-primary-box-shadow-color': 'hsl(205, 100%, 34%)', // active-box-shadow-color
    '--clr-btn-primary-checked-color': 'hsl(0, 0%, 100%)', // checked-color
    '--clr-btn-primary-disabled-color': 'var(--clr-btn-disabled-font-color)', // disabled-color
    '--clr-btn-primary-disabled-bg-color': 'var(--clr-btn-disabled-bg-color)', // disabled-bg-color
    '--clr-btn-primary-disabled-border-color': 'var(--clr-btn-disabled-border-color)', // disabled-border-color
    '--clr-btn-success-color': 'hsl(0, 0%, 0%)', // color, checked-color,
    '--clr-btn-success-bg-color': 'hsl(92, 79%, 40%)', // background-color, border-color
    '--clr-btn-success-hover-bg-color': 'hsl(83, 77%, 44%)', // hover-background-color
    '--clr-btn-success-hover-color': 'var(--clr-btn-success-color)', // hover-color
    '--clr-btn-success-box-shadow-color': 'hsl(98, 100%, 21%)', // active-box-shadow-color
    '--clr-btn-success-checked-bg-color': 'var(--clr-btn-success-hover-bg-color)', // checked-background-color
    '--clr-btn-success-disabled-color': 'var(--clr-btn-disabled-font-color)', // disabled-color
    '--clr-btn-success-disabled-bg-color': 'var(--clr-btn-disabled-bg-color)', // disabled-background-color
    '--clr-btn-success-disabled-border-color': 'var(--clr-btn-disabled-border-color)', // disabled-border-color
    '--clr-btn-success-outline-color': 'hsl(92, 79%, 40%)', // color
    '--clr-btn-success-outline-border-color': 'hsl(92, 79%, 40%)', // border-color, checked-background-color
    '--clr-btn-success-outline-hover-bg-color': 'hsla(0, 0%, 100%, 0.1)', // hover-background-color
    '--clr-btn-success-outline-hover-color': 'hsl(83, 77%, 44%)', // hover-color
    '--clr-btn-success-outline-box-shadow-color': 'hsl(0, 0%, 0%)', // active-box-shadow-color
    '--clr-btn-success-outline-checked-color': 'hsl(0, 0%, 100%)', // checked-color
    '--clr-btn-success-outline-disabled-color': 'var(--clr-btn-outline-disabled-font-color)', // disabled-color
    '--clr-btn-success-outline-disabled-bg-color': 'transparent', // disabled-background-color
    '--clr-btn-success-outline-disabled-border-color': 'var(--clr-btn-disabled-border-color)', // disabled-border-color
    '--clr-btn-danger-color': 'hsl(0, 0%, 0%)', // color, checked-color,
    '--clr-btn-danger-bg-color': 'hsl(3, 90%, 62%)', // background-color, border-color
    '--clr-btn-danger-hover-bg-color': 'hsl(3, 100%, 69%)', // hover-background-color
    '--clr-btn-danger-hover-color': 'var(--clr-btn-danger-color)', // hover-color
    '--clr-btn-danger-box-shadow-color': 'hsl(10, 100%, 39%)', // active-box-shadow-color
    '--clr-btn-danger-checked-bg-color': 'hsl(10, 100%, 39%)', // checked-background-color
    '--clr-btn-danger-disabled-color': 'var(--clr-btn-disabled-font-color)', // disabled-color),
    '--clr-btn-danger-disabled-bg-color': 'var(--clr-btn-disabled-bg-color)', // disabled-background-color
    '--clr-btn-danger-disabled-border-color': 'var(--clr-btn-disabled-border-color)', // disabled-border-color
    '--clr-btn-danger-outline-border-color': 'hsl(3, 90%, 62%)', // border-color
    '--clr-btn-danger-outline-color': 'hsl(3, 90%, 62%)', // color
    '--clr-btn-danger-outline-hover-bg-color': 'hsla(0, 0%, 100%, 0.1)', // hover-background-color
    '--clr-btn-danger-outline-hover-color': 'hsl(3, 100%, 69%)', // hover-color
    '--clr-btn-danger-outline-box-shadow-color': 'hsl(0, 0%, 0%)', // active-box-shadow-color
    '--clr-btn-danger-outline-checked-bg-color': 'hsl(3, 90%, 62%)', // checked-background-color
    '--clr-btn-danger-outline-checked-color': 'hsl(0, 0%, 100%)', // checked-color
    '--clr-btn-danger-outline-disabled-color': 'var(--clr-btn-outline-disabled-font-color)', // disabled-color
    '--clr-btn-danger-outline-disabled-bg-color': 'transparent', // disabled-background-color
    '--clr-btn-danger-outline-disabled-border-color': 'var(--clr-btn-disabled-border-color)', // disabled-border-color
    '--clr-btn-link-color': 'hsl(198, 65%, 57%)', // color
    '--clr-btn-link-hover-color': 'hsl(194, 78%, 63%)', // hover-color
    '--clr-btn-link-checked-color': 'hsl(198, 65%, 57%)', // checked-color
    '--clr-btn-link-disabled-color': 'var(--clr-btn-outline-disabled-font-color)', // disabled-color
    '--clr-btn-inverse-border-color': 'hsl(210, 16%, 93%)', // border-color
    '--clr-btn-inverse-bg-color': 'transparent', // background-color
    '--clr-btn-inverse-color': 'hsl(210, 16%, 93%)', // color
    '--clr-btn-inverse-hover-bg-color': 'rgba(0, 0, 0, 0.1)', // hover-background-color
    '--clr-btn-inverse-hover-color': 'hsl(0, 0%, 100%)', // hover-color
    '--clr-btn-inverse-box-shadow-color': 'hsl(203, 14%, 70%)', // active-box-shadow-color
    '--clr-btn-inverse-checked-bg-color': 'hsla(0, 0%, 100%, 0.15)', // checked-background-color
    '--clr-btn-inverse-checked-color': 'hsl(0, 0%, 100%)', // checked-color
    '--clr-btn-inverse-disabled-color': 'var(--clr-btn-outline-disabled-font-color)', // disabled-color
    '--clr-btn-inverse-disabled-border-color': 'var(--clr-btn-disabled-border-color)', // disabled-border-color
    '--clr-card-bg-color': 'hsl(198, 28%, 18%)',
    '--clr-card-border-color': 'hsl(203, 30%, 8%)',
    '--clr-card-title-color': 'hsl(210, 16%, 93%)',
    '--clr-card-box-shadow': '0 0.15rem 0 0 var(--clr-card-border-color)',
    '--clr-card-divider-color': 'var(--clr-card-border-color)',
    '--clr-datagrid-icon-color': 'hsl(203, 16%, 72%)',
    '--clr-datagrid-row-hover': 'hsl(201, 31%, 23%)',
    '--clr-datagrid-row-selected': 'hsl(0, 0%, 100%)',
    '--clr-datagrid-popover-bg-color': 'hsl(198, 28%, 18%)',
    '--clr-datagrid-action-toggle': 'hsl(203, 16%, 72%)',
    '--clr-datagrid-pagination-btn-color': 'hsl(210, 16%, 93%)',
    '--clr-datagrid-pagination-btn-disabled-color': 'hsl(210, 16%, 93%)',
    '--clr-datagrid-pagination-btn-disabled-opacity': '0.46',
    '--clr-datagrid-pagination-input-border-color': 'hsl(208, 16%, 34%)',
    '--clr-datagrid-pagination-input-border-focus-color': 'hsl(198, 65%, 57%)',
    '--clr-datagrid-popover-border-color': 'hsl(0, 0%, 0%)',
    '--clr-datagrid-action-popover-hover-color': 'var(--clr-datagrid-row-hover)',
    '--clr-datagrid-loading-background': 'rgba(0, 0, 0, 0.5)',
    '--clr-dropdown-active-text-color': 'hsl(0, 0%, 100%)',
    '--clr-dropdown-bg-color': 'hsl(198, 28%, 18%)',
    '--clr-dropdown-text-color': 'hsl(203, 16%, 72%)',
    '--clr-dropdown-item-color': 'hsl(203, 16%, 72%)',
    '--clr-dropdown-border-color': 'hsl(0, 0%, 0%)',
    '--clr-dropdown-child-border-color': 'hsl(0, 0%, 0%)',
    '--clr-dropdown-bg-active-color': 'var(--clr-global-selection-color)',
    '--clr-dropdown-bg-hover-color': 'var(--clr-global-hover-bg-color)',
    '--clr-dropdown-selection-color': 'hsl(203, 32%, 29%)',
    '--clr-dropdown-box-shadow': 'var(--clr-popover-box-shadow-color)',
    '--clr-dropdown-divider-color': 'var(--clr-dropdown-border-color)',
    '--clr-dropdown-header-color': 'hsl(203, 16%, 72%)',
    '--clr-calendar-background-color': 'hsl(198, 28%, 18%)',
    '--clr-calendar-border-color': 'hsl(0, 0%, 0%)',
    '--clr-datepicker-trigger-color': 'hsl(198, 65%, 57%)',
    '--clr-datepicker-trigger-hover-color': 'hsl(194, 78%, 63%)',
    '--clr-calendar-btn-color': 'hsl(198, 65%, 57%)',
    '--clr-calendar-btn-hover-focus-color': 'hsl(201, 31%, 23%)',
    '--clr-calendar-active-cell-background-color': 'hsl(203, 32%, 29%)',
    '--clr-calendar-active-focus-cell-background-color': 'hsl(203, 32%, 29%)',
    '--clr-calendar-today-date-cell-color': 'hsl(0, 0%, 100%)',
    '--clr-calendar-active-cell-color': 'hsl(0, 0%, 100%)',
    '--clr-forms-label-color': 'hsl(203, 16%, 72%)',
    '--clr-forms-text-color': 'hsl(210, 16%, 93%)', // No label, no wrapper
    '--clr-forms-invalid-color': 'hsl(3, 90%, 62%)',
    // '--clr-forms-subtext-color': 'hsl(0, 0%, 45%)',
    '--clr-forms-subtext-color': 'hsl(203, 16%, 72%)',
    '--clr-forms-border-color': 'hsl(203, 16%, 72%)',
    '--clr-forms-focused-color': 'hsl(198, 65%, 57%)', // Vertical no wrapper, no label
    '--clr-forms-textarea-background-color': 'hsl(201, 30%, 13%)',
    '--clr-forms-select-multiple-background-color': 'hsl(198, 28%, 18%)',
    '--clr-forms-select-multiple-border-color': 'hsl(0, 0%, 0%)',
    '--clr-forms-select-option-color': 'hsl(201, 30%, 13%)', // Option bg color on chrome/windows is white.
    '--clr-forms-checkbox-label-color': 'hsl(203, 16%, 72%)',
    '--clr-forms-checkbox-background-color': 'hsl(198, 65%, 57%)', // Use color here
    '--clr-forms-checkbox-checked-shadow': 'inset 0 0 0 0.3rem var(--clr-forms-checkbox-background-color)',
    '--clr-forms-checkbox-indeterminate-border-color': 'hsl(203, 16%, 72%)',
    '--clr-forms-checkbox-mark-color': 'hsl(0, 0%, 0%)',
    '--clr-forms-checkbox-disabled-background-color': 'hsl(204, 10%, 60%)',
    '--clr-forms-checkbox-disabled-mark-color': 'hsl(0, 0%, 0%)',
    '--clr-forms-radio-label-color': 'hsl(203, 16%, 72%)',
    '--clr-forms-radio-selected-shadow': 'var(--clr-forms-checkbox-checked-shadow)',
    '--clr-forms-radio-focused-shadow': '0 0 0.1rem 0.1rem var(--clr-link-active-color)',
    '--clr-forms-radio-disabled-background-color': 'hsl(0, 0%, 0%)',
    '--clr-forms-radio-disabled-mark-color': 'var(--clr-forms-checkbox-disabled-mark-color)',
    '--clr-forms-radio-disabled-shadow': 'var(--clr-forms-checkbox-checked-shadow)',
    '--clr-header-bgColor': 'hsl(214, 20%, 31%)',
    '--clr-header-default-bg-color': 'var(--clr-header-bgColor)',
    '--clr-header-1-bg-color': 'var(--clr-header-bgColor)',
    '--clr-header-2-bg-color': 'hsl(195, 65%, 24%)',
    '--clr-header-3-bg-color': 'hsl(206, 63%, 27%)',
    '--clr-header-4-bg-color': 'hsl(315, 27%, 28%)',
    '--clr-header-5-bg-color': 'hsl(233, 26%, 33%)',
    '--clr-header-6-bg-color': 'hsl(203, 30%, 8%)',
    '--clr-icon-color-success': 'hsl(92, 79%, 40%)',
    '--clr-icon-color-error': 'hsl(3, 90%, 62%)',
    '--clr-icon-color-warning': 'hsl(49, 98%, 51%)',
    '--clr-icon-color-info': 'hsl(198, 65%, 57%)',
    '--clr-icon-color-inverse': 'hsl(0, 0%, 100%)',
    '--clr-icon-color-highlight': 'hsl(198, 65%, 57%)',
    '--clr-label-font-color-light': 'hsl(0, 0%, 100%)',
    '--clr-label-font-color-dark': 'hsl(0, 0%, 0%)',
    '--clr-label-bg-hover-color': 'hsl(0, 0%, 34%)',
    '--clr-label-gray-bg-color': 'hsl(211, 10%, 47%)',
    '--clr-label-purple-bg-color': 'hsl(281, 44%, 62%)',
    '--clr-label-blue-bg-color': 'hsl(201, 100%, 36%)',
    '--clr-label-orange-bg-color': 'hsl(31, 100%, 60%)',
    '--clr-label-light-blue-bg-color': 'hsl(194, 57%, 71%)',
    '--clr-label-info-bg-color': 'hsl(198, 79%, 28%)',
    '--clr-label-info-font-color': 'var(--clr-label-font-color-light)',
    '--clr-label-info-border-color': 'var(--clr-label-info-bg-color)',
    '--clr-label-success-bg-color': 'hsl(122, 45%, 23%)',
    '--clr-label-success-font-color': 'var(--clr-label-font-color-light)',
    '--clr-label-success-border-color': 'var(--clr-label-success-bg-color)',
    '--clr-label-danger-bg-color': 'hsl(357, 50%, 35%)',
    '--clr-label-danger-font-color': 'var(--clr-label-font-color-light)',
    '--clr-label-danger-border-color': 'var(--clr-label-danger-bg-color)',
    '--clr-label-warning-bg-color': 'hsl(47, 87%, 27%)',
    '--clr-label-warning-font-color': 'var(--clr-label-font-color-light)',
    '--clr-label-warning-border-color': 'var(--clr-label-warning-bg-color)',
    '--clr-login-background-color': 'var(--clr-global-app-background)',
    '--clr-modal-close-color': 'hsl(203, 16%, 72%)',
    '--clr-modal-bg-color': 'hsl(198, 28%, 18%)',
    '--clr-modal-backdrop-color': 'hsla(0, 0%, 0%, 0.85)',
    '--clr-sliding-panel-text-color': 'hsl(0, 0%, 34%)',
    '--clr-transition-style': 'ease',
    '--clr-nav-background-color': 'hsl(0, 0%, 93%)',
    // '--clr-nav-background-color': 'hsl(201, 30%, 15%)',
    '--clr-responsive-nav-hover-bg': 'var(--clr-global-selection-color)',
    // '--clr-sliding-panel-text-color': 'hsl(0, 0%, 100%)',
    '--clr-sidenav-border-color': 'hsl(200, 30%, 12%)',
    '--clr-sidenav-link-hover-color': 'var(--clr-global-selection-color)',
    '--clr-subnav-bgColor': 'hsl(201, 30%, 13%)',
    '--clr-nav-shadow': '0 -0.05rem 0 hsl(208, 16%, 34%) inset',
    '--clr-progress-defaultBarColor': 'hsl(198, 65%, 57%)',
    '--clr-progress-success-color': 'hsl(92, 79%, 40%)',
    '--clr-progress-danger-color': 'hsl(3, 90%, 62%)',
    '--clr-progress-warning-color': 'var(--clr-progress-danger-color)',
    '--clr-progress-bg-color': 'hsl(200, 23%, 25%)',
    '--clr-signpost-action-color': 'hsl(210, 16%, 93%)',
    '--clr-signpost-action-hover-color': 'hsl(198, 65%, 57%)',
    '--clr-signpost-content-bg-color': 'hsl(198, 28%, 18%)',
    '--clr-signpost-content-border-color': 'hsl(0, 0%, 0%)',
    '--clr-signpost-border-size': '0.5rem',
    '--clr-signpost-pointer-border': 'var(--clr-signpost-border-size solid--clr-signpost-content-border-color)',
    '--clr-signpost-pointer-invisible-border': 'var(--clr-signpost-border-size solid transparent)',
    '--clr-signpost-pointer-psuedo-border': 'var(--clr-signpost-border-size solid--clr-signpost-content-bg-color)',
    '--clr-spinner-color': 'hsl(198, 65%, 57%)',
    '--clr-spinner-bg-color': 'hsl(200, 23%, 25%)',
    '--clr-spinner-opacity': '1',
    '--clr-stack-view-border-color': 'hsl(208, 14%, 39%)',
    '--clr-stack-view-bg-color': 'var(--clr-global-app-background)',
    '--clr-stack-view-stack-block-border-bottom': 'var(--clr-stack-view-border-color)', // border-bottom for stack-view rows) (not last)
    '--clr-stack-view-border-box-color': 'var(--clr-stack-view-border-color)',
    '--clr-stack-block-changed-border-top-color': 'hsl(205, 100%, 34%)', // TODO': 'Figure out where this shows in the UI.
    '--clr-stack-view-stack-block-label-and-content-bg-color': 'var(--clr-global-app-background)', // stkvw row bg color) when not expanded
    '--clr-stack-view-stack-children-stack-block-border-bottom-color': 'var(--clr-stack-view-border-color)', // children of) an expanded row
    '--clr-stack-view-stack-children-stack-block-label-and-content-bg-color': 'hsl(198, 28%, 18%)',
    '--clr-stack-view-stack-block-label-text-color': 'hsl(212, 10%, 61%)',
    '--clr-stack-view-stack-block-expanded-bg-color': 'hsl(203, 32%, 29%)',
    '--clr-stack-view-stack-block-expandable-hover': 'hsl(203, 32%, 29%)',
    '--clr-stack-view-stack-block-content-text-color': 'hsl(203, 16%, 72%)',
    '--clr-stack-view-stack-block-expanded-text-color': 'hsl(0, 0%, 100%)',
    '--clr-stack-view-stack-block-caret-color': 'hsl(0, 0%, 60%)',
    '--clr-thead-bgcolor': 'hsl(201, 30%, 15%)',
    '--clr-table-bgcolor': 'hsl(198, 28%, 18%)',
    '--clr-table-font-color': 'hsl(203, 16%, 72%)',
    '--clr-thead-color': 'var(--clr-table-font-color)',
    '--clr-datagrid-default-border-color': 'hsl(208, 16%, 34%)',
    '--clr-table-header-border-bottom-color': 'var(--clr-datagrid-default-border-color)',
    '--clr-table-footer-border-top-color': 'var(--clr-datagrid-default-border-color)',
    '--clr-tablerow-bordercolor': 'var(--clr-datagrid-default-border-color)',
    '--clr-table-border-color': 'var(--clr-datagrid-default-border-color)',
    '--clr-table-bordercolor': 'var(--clr-datagrid-default-border-color)',
    '--clr-table-borderstyle': '0.05rem solid var(--clr-datagrid-default-border-color)',
    '--clr-nav-box-shadow-color': 'hsl(208, 16%, 34%)',
    '--clr-nav-active-box-shadow-color': 'hsl(198, 65%, 57%)',
    '--clr-nav-link-active-color': 'hsl(0, 0%, 100%)',
    '--clr-nav-link-color': 'hsl(203, 16%, 72%)',
    '--clr-timeline-line-color': 'hsl(203, 16%, 72%)',
    '--clr-timeline-step-header-color': 'hsl(210, 17%, 93%)',
    '--clr-timeline-step-title-color': 'hsl(203, 16%, 72%)', // #565656
    '--clr-timeline-step-description-color': 'hsl(203, 16%, 72%)', // #565656
    '--clr-timeline-incomplete-step-color': 'hsl(210, 17%, 93%)',
    '--clr-timeline-current-step-color': 'hsl(198, 65%, 57%)',
    '--clr-timeline-success-step-color': 'hsl(92, 79%, 40%)',
    '--clr-timeline-error-step-color': 'hsl(3, 90%, 62%)',
    '--clr-tooltip-color': 'hsl(0, 0%, 0%)',
    '--clr-tooltip-background-color': 'hsl(0, 0%, 100%)',
    '--clr-tree-node-caret-link-hover-color': 'hsl(0, 0%, 100%)',
    '--clr-tree-link-color': 'hsl(0, 0%, 93%)',
    '--clr-tree-link-hover-color': 'var(--clr-global-hover-bg-color)',
    '--clr-tree-link-selection-color': 'var(--clr-global-selection-color)',
    '--clr-tree-link-text-color': 'hsl(203, 16%, 72%)',
    '--clr-tree-node-caret-color': 'hsl(203, 16%, 72%)',
    '--clr-global-font-color': 'hsl(210, 16%, 93%)',
    '--clr-global-font-color-secondary': 'hsl(203, 16%, 72%)',
    '--clr-h1-color': 'var(--clr-global-font-color)',
    '--clr-h2-color': 'var(--clr-global-font-color)',
    '--clr-h3-color': 'var(--clr-global-font-color)',
    '--clr-h4-color': 'var(--clr-global-font-color)',
    '--clr-h5-color': 'var(--clr-global-font-color)',
    '--clr-h6-color': 'var(--clr-global-font-color-secondary)',
    '--clr-p1-color': 'var(--clr-global-font-color-secondary)',
    '--clr-p2-color': 'var(--clr-global-font-color-secondary)',
    '--clr-p3-color': 'var(--clr-global-font-color-secondary)',
    '--clr-p4-color': 'var(--clr-global-font-color)',
    '--clr-p5-color': 'var(--clr-global-font-color)',
    '--clr-p6-color': 'var(--clr-global-font-color)',
    '--clr-p7-color': 'var(--clr-global-font-color)',
    '--clr-p8-color': 'var(--clr-global-font-color)',
    '--clr-vertical-nav-item-color': 'hsl(203, 16%, 72%)',
    '--clr-vertical-nav-item-active-color': 'hsl(0, 0%, 100%)',
    '--clr-vertical-nav-bg-color': 'hsl(201, 30%, 13%)',
    '--clr-vertical-nav-active-bg-color': 'var(--clr-global-selection-color)',
    '--clr-vertical-nav-hover-bg-color': 'var(--clr-global-hover-bg-color)',
    '--clr-vertical-nav-icon-active-color': 'hsl(0, 0%, 100%)',
    '--clr-vertical-nav-toggle-icon-color': 'hsl(203, 16%, 72%)',
    '--clr-vertical-nav-trigger-divider-border-color': 'hsl(199, 19%, 17%)',
    '--clr-wizard-sidenav-bgcolor': 'hsl(201, 30%, 15%)',
    '--clr-wizard-sidenav-text--active': 'hsl(0, 0%, 100%)',
    '--clr-wizard-stepnav-active-bgcolor': 'hsl(203, 32%, 29%)',
    '--clr-wizard-stepnav-border-color': 'hsl(201, 14%, 27%)',
    '--clr-wizard-stepnav-border-color--active': 'hsl(92, 79%, 40%)',
    '--clr-wizard-step-nav-border-color': 'hsl(200, 30%, 12%)',
    '--clr-wizard-sidenav-text': 'hsl(203, 16%, 72%)',
    '--clr-wizard-title-text': 'hsl(210, 16%, 93%)',
    '--clr-wizard-main-textColor': 'hsl(203, 16%, 72%)',
    '--clr-wizard-stepnav-error-color': 'hsl(3, 90%, 62%)',
    '--clr-accordion-text-color': 'var(--clr-color-neutral-0)',
    '--clr-accordion-active-background-color': 'var(--clr-global-selection-color)',
    '--clr-accordion-header-hover-background-color': 'var(--clr-global-selection-color)',
    '--clr-accordion-content-background-color': 'hsl(198, 28%, 18%)',
    '--clr-accordion-header-background-color': 'hsl(201, 30%, 15%)',
    '--clr-accordion-border-left-color': 'hsl(202, 30%, 24%)',
    '--clr-accordion-border-color': 'hsl(208, 16%, 34%)',
    '--clr-login-background': '%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20width%3D%22736px%22%20height%3D%22838px%22%20viewBox%3D%220%200%20736%20838%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Ctitle%3Evector%20art%3C%2Ftitle%3E%3Cdesc%3ECreated%20with%20Sketch.%3C%2Fdesc%3E%3Cdefs%3E%3C%2Fdefs%3E%3Cg%20id%3D%22symbols%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20id%3D%22Login%22%20transform%3D%22translate(-504.000000%2C%200.000000)%22%3E%3Cg%20id%3D%22replaceable-image%22%20transform%3D%22translate(504.000000%2C%200.000000)%22%3E%3Cg%20id%3D%22vector-art%22%20transform%3D%22translate(-78.000000%2C%20-82.000000)%22%3E%3Crect%20id%3D%22Rectangle-path%22%20fill%3D%22%2322343E%22%20x%3D%220%22%20y%3D%220.38%22%20width%3D%221127.55%22%20height%3D%22921.62%22%3E%3C%2Frect%3E%3Cpolygon%20id%3D%22Shape%22%20fill%3D%22%232F657B%22%20points%3D%220%203.06%200%20599.24%20298.14%20301.43%22%3E%3C%2Fpolygon%3E%3Cpolygon%20id%3D%22Shape%22%20fill%3D%22%23438597%22%20points%3D%220%20408.65%200%20599.24%2095.29%20504.06%22%3E%3C%2Fpolygon%3E%3Cpolygon%20id%3D%22Shape%22%20fill%3D%22%232F657B%22%20points%3D%22918.21%20921.95%20818.63%20822.3%20718.89%20921.95%22%3E%3C%2Fpolygon%3E%3Cpolygon%20id%3D%22Shape%22%20fill%3D%22%233B758E%22%20points%3D%22818.63%20822.3%20298.14%20301.43%200%20599.24%200%20655.02%20266.51%20921.95%20718.89%20921.95%22%3E%3C%2Fpolygon%3E%3Cpolygon%20id%3D%22Shape%22%20fill%3D%22%23579EB2%22%20points%3D%22512.67%20921.95%2095.29%20504.06%200%20599.24%200%20654.97%20267.06%20921.95%22%3E%3C%2Fpolygon%3E%3Cpolygon%20id%3D%22Shape%22%20fill%3D%22%23344B57%22%20points%3D%22266.51%20921.95%200%20655.02%200%20921.95%22%3E%3C%2Fpolygon%3E%3Cpolygon%20id%3D%22Shape%22%20fill%3D%22%23A7C9D5%22%20points%3D%221128%200%20799.58%200%201128%20329.83%22%3E%3C%2Fpolygon%3E%3Cpolygon%20id%3D%22Shape%22%20fill%3D%22%23344B57%22%20points%3D%221128%20329.83%20799.58%200%20599.9%200%20298.14%20301.43%20818.63%20822.3%201128%20513.18%22%3E%3C%2Fpolygon%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',


    /**********
     * Custom
     */
    '--clr-custom-dark-display': 'block',
    '--clr-custom-light-display': 'none',
    '--clr-custom-background-highlight': 'hsl(201, 30%, 13%)',
    '--clr-custom-border-active': 'white',
    '--clr-custom-flo-highlight': 'hsl(209, 56%, 31%)',
    '--clr-custom-flo-highlight-border': 'white',
    '--clr-custom-flo-search-icon': 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDM1MiwgMjAyMC8wMS8zMC0xNTo1MDozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTAzMjAwMDNBRDdCMTFFQUFBQzVBNURCRkM5QUE4RTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTAzMjAwMDRBRDdCMTFFQUFBQzVBNURCRkM5QUE4RTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MDMyMDAwMUFEN0IxMUVBQUFDNUE1REJGQzlBQThFMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MDMyMDAwMkFEN0IxMUVBQUFDNUE1REJGQzlBQThFMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpyN7UAAAAYgSURBVHja7Jxb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\')',

    '--clr-custom-app-label-source-bg-1': '#356d8f',
    '--clr-custom-app-label-source-bg-2': '#2e7a94',
    '--clr-custom-app-label-sink-bg-1': '#927a38',
    '--clr-custom-app-label-sink-bg-2': '#9b643b',
    '--clr-custom-app-label-processor-bg-1': '#4c7036',
    '--clr-custom-app-label-processor-bg-2': '#3d6e4f',
    '--clr-custom-app-label-app-bg-1': '#504195',
    '--clr-custom-app-label-app-bg-2': '#66448f',
    '--clr-custom-app-label-task-bg-1': '#884c47',
    '--clr-custom-app-label-task-bg-2': '#8f466e',

    '--clr-custom-stream-label-deploying-bg-1': '#356d8f',
    '--clr-custom-stream-label-deploying-bg-2': '#2e7a94',
    '--clr-custom-stream-label-deployed-bg-1': '#4c7036',
    '--clr-custom-stream-label-deployed-bg-2': '#566e27',
    '--clr-custom-stream-label-incomplete-bg-1': '#927b38',
    '--clr-custom-stream-label-incomplete-bg-2': '#9b653b',
    '--clr-custom-stream-label-failed-bg-1': '#864623',
    '--clr-custom-stream-label-failed-bg-2': '#882421',
    '--clr-custom-stream-label-undeployed-bg-1': '#535262',
    '--clr-custom-stream-label-undeployed-bg-2': '#3e3d58',


    '--clr-custom-task-label-running-bg-1': '#356d8f',
    '--clr-custom-task-label-running-bg-2': '#2e7a94',
    '--clr-custom-task-label-complete-bg-1': '#4c7036',
    '--clr-custom-task-label-complete-bg-2': '#566e27',
    '--clr-custom-task-label-unknown-bg-1': '#927b38',
    '--clr-custom-task-label-unknown-bg-2': '#9b653b',
    '--clr-custom-task-label-error-bg-1': '#864623',
    '--clr-custom-task-label-error-bg-2': '#882421',


    '--clr-custom-execution-label-completed-bg-1': '#4c7036',
    '--clr-custom-execution-label-completed-bg-2': '#566e27',
    '--clr-custom-execution-label-error-bg-1': '#864623',
    '--clr-custom-execution-label-error-bg-2': '#882421',

    '--clr-custom-record-action-label-running-bg-1': '#17518a',
    '--clr-custom-record-action-label-running-bg-2': '#1d5c98',
    '--clr-custom-search-bg-opacity': '.4',
    '--clr-custom-search-bg': 'hsl(203, 32%, 29%)',
    '--clr-custom-search-bg-selection': 'hsl(201, 30%, 15%)',

  },
  other: 'clr-icon.is-green,clr-icon.is-success{fill:var(--clr-icon-color-success)}' +
    'clr-icon.is-red,clr-icon.is-danger,clr-icon.is-error{fill:var(--clr-icon-color-error)}' +
    'clr-icon.is-warning{fill:var(--clr-icon-color-warning)}' +
    'clr-icon.is-blue,clr-icon.is-info{fill:var(--clr-icon-color-info)}' +
    'clr-icon.is-white,clr-icon.is-inverse{fill:var(--clr-icon-color-inverse)}' +
    'clr-icon.is-highlight{fill:var(--clr-icon-color-highlight)}'
};
