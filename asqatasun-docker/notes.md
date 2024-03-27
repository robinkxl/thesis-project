# Asaqatasun

## Installation
See [https://gitlab.com/asqatasun/asqatasun-docker/-/tree/main/5.x](https://gitlab.com/asqatasun/asqatasun-docker/-/tree/main/5.x)

## Testing the tool

We created a bash script to run and test Asqatasun (see asqatasun_audit.bash).
Note that we run the tool on our deployed website's webpages instead of the development webpages due to issues with the tool.
Despite many hours of debugging we were not able to run the tool on our development website at http://localhost:1338/.

Relevant links:
- Debugging localhost issues: https://forum.asqatasun.org/t/api-return-a-message-subject-must-not-null/822
- API doc: https://doc.asqatasun.org/v5/en/Developer/API/ 

## Integration in CI pipeline

We have tried to implement the tool into an example CI pipeline but have encountered several obstacles:
- As explained in the section [above](#testing-the-tool), we cannot run the tool on our website in development mode.
- Starting and running the Asqatasun docker container in a github actions workflow takes up considerable time.
- Creating an audit can take several seconds to minutes depending on the size of the webpage scanned.
- Since the results from the audits can only be accessed once the audits are complete and their completion time varies, one can only with difficulty print or save the results.

## Interpreting the audit results

Asqatasun provides a json file containing a summary of the audit tests run on a specific webpage. Moreover one can download a csv file with all the tests performed for the given webpage accompanied by a "grade".

Details about the tests can be found [here](https://github.com/DISIC/RGAA/tree/master).
A json file of the RGAA can also be found in this folder (see criteres_vx.x.json).

The provided "grades" are as follows:
* **c** stands for "passed".
* **na** stands for "not applicable"
* **nc** stands for failed
* **nt** stands for "not tested"
* **pq** stands for "needs more information"

The meaning of these grades were determined based on the summary json files.