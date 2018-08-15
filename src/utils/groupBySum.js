/**
 *
 * @param data
 * @return {*}
 */
const groupBySum = data => {
   const groups = data.reduce((ite, cur) => {
       if (!cur.group) return ite;
       else if (ite[cur.group]) ite[cur.group].push(cur);
       else ite[cur.group] = [cur];

       return ite;
   }, {});

   let min = undefined, max = undefined, sum = undefined, res = {};
   for(let i in groups) {
       const data = groups[i];
       res[i] = {
           data,
           sum: data.reduce((ite, cur) => (ite += cur.value, ite), 0)
       };

       min = min === undefined || min > res[i].sum
           ? res[i].sum
           : min;

       max = max === undefined || max < res[i].sum
           ? res[i].sum
           : max;

       sum += res[i].sum;
   }

   for (let i in res) {
       res[i].opacity = Math.max((max - res[i].sum) / (max - min), 0.1);
   }

   return res;
};


export default groupBySum;
