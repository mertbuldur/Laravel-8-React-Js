<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    const ENTRY = 0;
    const OUT = 1;
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['stockTypeString'];

    public function getStockTypeStringAttribute(){
        switch($this->attributes['stockType']){
            case self::ENTRY:
                return "Stok Giriş";
                break;
            case self::OUT:
                return "Stok Çıkış";
                break;
        }
    }
    public function customer(){
        return $this->hasOne(Customer::class,'id','customerId');
    }

    public function product(){
        return $this->hasOne(Product::class,'id','productId');
    }
}
