'use strict';

const baseURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const detailsURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

const insertDataintoDOM = (array) => {
  const div = document.createElement('div');

  div.insertAdjacentHTML('beforeend',
    `<ul>${array.map(element =>
      `<li>
        ${element.name}
        </li>`).join('')}
    </ul>`);
  document.body.append(div);
};

function getPhones() {
  const promise = new Promise(function(resolve, reject) {
    setTimeout(() => {
      reject(new Error('Rejected within timeout'));
    }, 5000);

    resolve(fetch(`${baseURL}`)
      .then(response => {
        return (!response.ok) ? Promise.reject(new Error(`${response.status}`))
          : Promise.resolve(response.json());
      }));
  });

  return promise;
}

getPhones()
  .then(response => {
    const arrayOfIDs = response.map(element => element.id);

    async function getPhonesDetails(iDs) {
      const phoneDetails = [];

      for (let indx = 0; indx < iDs.length; indx++) {
        const uRL = `${detailsURL}${iDs[indx]}.json`;
        const result = await fetch(uRL);

        if (!result.ok && result.status === 404) {
          return new Promise(function(resolve, reject) {
            reject(new Error(`${response.status}`));
          });
        }

        if (!result.headers.get('content-type').includes('application/json')) {
          return new Promise(function(resolve, reject) {
            reject(new Error(`Content type is not supported`));
          });
        }

        const details = await result.json();

        phoneDetails.push(details);
      }

      insertDataintoDOM(phoneDetails);

      return phoneDetails;
    }

    return getPhonesDetails(arrayOfIDs);
  })
  .then(result => console.log(result, 'success'))
  .catch(error => console.warn(error));
