/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Supports pagination. Page numbers are '0'-based.
 *
 * @author Gunnar Hillert
 */
define(function() {
  'use strict';
  return function Pageable(items, total) {
    if (items === undefined) {
      this.items = items;
    }
    else {
      this.items = {};
    }

    if (total === undefined) {
      this.total = total;
    }
    else {
      this.total = 0;
    }
    this.pageNumber = 0;
    this.pageSize = 10;
    this.sortProperty = [''];
    this.sortOrder = ''; //ASC or DESC

    this.calculateSortParameter = function calculateSortParameter() {
      var arrayLength = this.sortProperty.length;
      var sortParam = '';
      for (var i = 0; i < arrayLength; i++) {
        var sortPropertyValue = this.sortProperty[i];
        if (i === 0) {
          sortParam = sortPropertyValue;
        }
        else {
          sortParam = sortParam + ',' + sortPropertyValue;
        }
        if (i === arrayLength - 1) {
          sortParam = sortParam + ',' + this.sortOrder;
        }
      }
      return sortParam;
    };
  };
});
