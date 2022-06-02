
const pull_data = async ()=>{
 let response = await fetch("https://api.russiafossiltracker.com/v0/counter_last?destination_region=EU&use_eu=True&aggregate_by=destination_region,commodity_group");
 if (response.status != 200) {
    console.log("Error loading data")
  } else {
     let api_data = await response.json();
     let data = {}

     const total = api_data.data.find(x => (x.commodity_group == 'total'));
     data.total_eur_updated = total.total_eur
     data.total_eur_per_sec = total.eur_per_sec

     const oil = api_data.data.find(x => (x.commodity_group == 'oil'));
     data.oil_eur_updated = oil.total_eur
     data.oil_eur_per_sec = oil.eur_per_sec

     const gas = api_data.data.find(x => (x.commodity_group == 'gas'));
     data.gas_eur_updated = gas.total_eur
     data.gas_eur_per_sec = gas.eur_per_sec

     const coal = api_data.data.find(x => (x.commodity_group == 'coal'));
     data.coal_eur_updated = coal.total_eur
     data.coal_eur_per_sec = coal.eur_per_sec
     run_auto_counter(data);
  }
}

const run_auto_counter = async(data)=>{
    update_ui(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    data.total_eur_updated += data.total_eur_per_sec;
    data.oil_eur_updated += data.oil_eur_per_sec;
    data.gas_eur_updated += data.gas_eur_per_sec;
    data.coal_eur_updated += data.coal_eur_per_sec;
    run_auto_counter(data)
}

const update_ui = (data)=>{
    document.getElementById('total_eur').innerText = Math.floor(data.total_eur_updated).toLocaleString('en-US');
    document.getElementById('oil_mneur').innerText = Math.floor(data.oil_eur_updated/1000000).toLocaleString('en-US');
    document.getElementById('coal_mneur').innerText = Math.floor(data.coal_eur_updated/1000000).toLocaleString('en-US');
    document.getElementById('gas_mneur').innerText = Math.floor(data.gas_eur_updated / 1000000).toLocaleString('en-US');
    
    
    // Renewable energy
    document.getElementById('offshore_units').innerText = Math.floor(data.total_eur_updated / 32749122.81 / 6).toLocaleString('en-US');
    document.getElementById('onshore_units').innerText = Math.floor(data.total_eur_updated / 5315789.47 / 6).toLocaleString('en-US');
    document.getElementById('solarrooftop_units').innerText = Math.floor(data.total_eur_updated / 13603.07 / 6).toLocaleString('en-US');
    document.getElementById('solarutility_units').innerText = Math.floor(data.total_eur_updated / 1377894.74 / 6).toLocaleString('en-US');
    document.getElementById('heatpump_units').innerText = Math.floor(data.total_eur_updated / 10701.75 / 6).toLocaleString('en-US');
    document.getElementById('insulatedhome_units').innerText = Math.floor(data.total_eur_updated / 36609.33 / 6).toLocaleString('en-US');

}


const set_counter = ()=>{
    document.addEventListener('DOMContentLoaded', (event) => {
        pull_data();    
    })
}
